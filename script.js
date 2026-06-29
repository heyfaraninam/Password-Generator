// ── CHAR SETS ──
const SETS = {
  upper  : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower  : 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

// ── STATE ──
let history = JSON.parse(localStorage.getItem('pass_history') || '[]');

// ── DOM ──
const $output   = document.getElementById('pass-output');
const $copyBtn  = document.getElementById('copy-btn');
const $slider   = document.getElementById('length-slider');
const $sliderVal= document.getElementById('slider-val');
const $sBars    = document.querySelectorAll('.s-bar');
const $sLabel   = document.getElementById('strength-label');
const $exclude  = document.getElementById('exclude-inp');
const $histCard = document.getElementById('history-card');
const $histList = document.getElementById('history-list');
const $toast    = document.getElementById('toast');

// ── TOGGLES ──
function togVal(id){ return document.getElementById(id).checked; }

// ── SLIDER ──
$slider.addEventListener('input', () => {
  $sliderVal.textContent = $slider.value;
  updateSliderTrack();
  generate();
});
function updateSliderTrack(){
  const min=+$slider.min, max=+$slider.max, val=+$slider.value;
  const pct = ((val-min)/(max-min))*100;
  $slider.style.setProperty('--pct', pct+'%');
}

// ── GENERATE ──
function generate(){
  const len     = +$slider.value;
  const exclude = $exclude.value;
  let pool = '';
  if(togVal('tog-upper'))   pool += SETS.upper;
  if(togVal('tog-lower'))   pool += SETS.lower;
  if(togVal('tog-numbers')) pool += SETS.numbers;
  if(togVal('tog-symbols')) pool += SETS.symbols;

  // remove excluded chars
  if(exclude) pool = [...pool].filter(c => !exclude.includes(c)).join('');

  if(!pool){ toast('Enable at least one character type', 'blue'); return; }

  // cryptographically secure random
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  let pass = '';
  for(let i=0;i<len;i++) pass += pool[arr[i] % pool.length];

  // ensure at least one of each enabled type
  let guaranteed = '';
  const types = [];
  if(togVal('tog-upper'))   types.push(SETS.upper);
  if(togVal('tog-lower'))   types.push(SETS.lower);
  if(togVal('tog-numbers')) types.push(SETS.numbers);
  if(togVal('tog-symbols')) types.push(SETS.symbols);
  types.forEach(set => {
    const filtered = [...set].filter(c => !exclude.includes(c));
    if(filtered.length){
      const r = new Uint32Array(1);
      crypto.getRandomValues(r);
      guaranteed += filtered[r[0] % filtered.length];
    }
  });
  // splice guaranteed chars into random positions
  if(guaranteed.length <= len){
    const passArr = [...pass];
    [...guaranteed].forEach((ch,i) => { passArr[i] = ch; });
    // shuffle just the guaranteed positions
    for(let i=guaranteed.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [passArr[i],passArr[j]] = [passArr[j],passArr[i]];
    }
    pass = passArr.join('');
  }

  $output.textContent = pass;
  $output.classList.remove('flash');
  void $output.offsetWidth;
  $output.classList.add('flash');

  renderStrength(pass);
  return pass;
}

// ── STRENGTH ──
function calcStrength(pass){
  let score = 0;
  if(pass.length >= 8)  score++;
  if(pass.length >= 12) score++;
  if(pass.length >= 16) score++;
  if(pass.length >= 20) score++;
  if(/[A-Z]/.test(pass)) score++;
  if(/[a-z]/.test(pass)) score++;
  if(/[0-9]/.test(pass)) score++;
  if(/[^A-Za-z0-9]/.test(pass)) score++;
  // score 0-8
  if(score <= 2) return {level:0,label:'Weak',    color:'#f72585'};
  if(score <= 4) return {level:1,label:'Fair',    color:'#ffd166'};
  if(score <= 6) return {level:2,label:'Good',    color:'#48cae4'};
  return             {level:3,label:'Strong',  color:'#39ff83'};
}

function renderStrength(pass){
  const {level,label,color} = calcStrength(pass);
  $sBars.forEach((bar,i) => {
    bar.style.background = i <= level ? color : 'rgba(255,255,255,0.08)';
    bar.style.boxShadow  = i <= level ? `0 0 6px ${color}55` : 'none';
  });
  $sLabel.textContent = label;
  $sLabel.style.color = color;
}

// ── COPY ──
function copyPass(){
  const pass = $output.textContent.trim();
  if(!pass || pass === '—') return;
  navigator.clipboard.writeText(pass).then(() => {
    $copyBtn.textContent = '✓';
    $copyBtn.classList.add('copied');
    setTimeout(()=>{ $copyBtn.textContent='⧉'; $copyBtn.classList.remove('copied'); }, 1800);
    toast('Copied to clipboard!', 'green');
    saveHistory(pass);
  });
}

// ── HISTORY ──
function saveHistory(pass){
  const {label,color} = calcStrength(pass);
  history.unshift({pass, label, color});
  if(history.length > 20) history.pop();
  localStorage.setItem('pass_history', JSON.stringify(history));
  renderHistory();
  $histCard.classList.add('show');
}

function renderHistory(){
  if(!history.length){
    $histList.innerHTML = '<div class="history-empty">No passwords copied yet.</div>';
    return;
  }
  $histList.innerHTML = '';
  history.forEach((h,i) => {
    const el = document.createElement('div');
    el.className = 'history-item';
    el.style.animationDelay = (i*0.04)+'s';
    el.innerHTML = `
      <span class="hi-pass">${h.pass}</span>
      <span class="hi-strength" style="color:${h.color};background:${h.color}18;border:1px solid ${h.color}33">${h.label}</span>
      <span class="hi-copy">⧉</span>`;
    el.onclick = () => {
      navigator.clipboard.writeText(h.pass);
      toast('Copied!', 'green');
    };
    $histList.appendChild(el);
  });
}

window.clearHistory = function(){
  history = [];
  localStorage.removeItem('pass_history');
  renderHistory();
  toast('History cleared');
};

// ── TOGGLE CHANGE ──
document.querySelectorAll('.toggle input').forEach(t => t.addEventListener('change', generate));
$exclude.addEventListener('input', generate);
$output.addEventListener('click', copyPass);

// ── TOAST ──
let toastT;
function toast(msg, type=''){
  $toast.textContent = msg;
  $toast.className = 'toast show '+type;
  clearTimeout(toastT);
  toastT = setTimeout(()=>$toast.className='toast', 2000);
}

// ── EXPOSE ──
window.generate = generate;
window.copyPass = copyPass;

// ── BOOT ──
updateSliderTrack();
generate();
renderHistory();
if(history.length) $histCard.classList.add('show');
