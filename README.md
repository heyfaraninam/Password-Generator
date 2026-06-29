<div align="center">

# ✦ PASSWORD GENERATOR

### A glassmorphic password generator with strength meter, exclude filter, and copy history — built in pure HTML, CSS & JS.

<br/>

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen?style=for-the-badge)
![Crypto API](https://img.shields.io/badge/crypto-Web%20Crypto%20API-blueviolet?style=for-the-badge)

<br/>

> Cryptographically secure · Strength meter · Exclude chars · History of copied passwords

<br/>

</div>

---

## ✦ Features

### 🔐 Cryptographically Secure
Uses the browser's built-in `crypto.getRandomValues()` — the same API used by security tools. Not `Math.random()`.

### 📏 Length Slider
Drag from 4 to 64 characters. The slider track fills with the accent colour as you drag. Password regenerates instantly.

### 🔡 Four Character Type Toggles
Enable or disable any combination:

| Toggle | Characters |
|--------|-----------|
| Uppercase | A – Z |
| Lowercase | a – z |
| Numbers | 0 – 9 |
| Symbols | ! @ # $ % ^ & * ( ) … |

Each enabled type is **guaranteed** to appear at least once in every generated password.

### 💪 Strength Meter
Four animated bars fill and colour-shift based on password strength:

| Level | Colour | Criteria |
|-------|--------|---------|
| Weak | 🔴 Pink | Short, few types |
| Fair | 🟡 Yellow | Medium length or limited types |
| Good | 🔵 Cyan | Good length + multiple types |
| Strong | 🟢 Green | Long + all types enabled |

### 🚫 Exclude Characters
Type any characters you want removed from the pool — useful for avoiding ambiguous characters like `0 O l I 1` that look similar in certain fonts.

### 📋 One-Click Copy
Click the copy button or click directly on the password to copy it instantly. Button turns green to confirm.

### 🕓 Copy History
Every copied password is saved to `localStorage` and shown in the history panel with its strength label. Click any history entry to copy it again. Stores up to 20 entries.

---

## ✦ Getting Started

```bash
git clone https://github.com/heyfaraninam/Password-Generator.git
cd Password-Generator
open index.html
```

No build step. No npm. No config.

---

## ✦ File Structure

```
password-generator/
├── index.html     # Layout, toggles, slider, history panel
├── styles.css     # Glassmorphism, slider track, toggle switches, strength bars
└── scirpt.js         # Crypto generation, strength calc, copy, localStorage history
```

---

## ✦ How the Generator Works

```javascript
// Cryptographically secure random
const arr = new Uint32Array(length);
crypto.getRandomValues(arr);
let password = '';
for (let i = 0; i < length; i++) {
  password += pool[arr[i] % pool.length];
}
```

After generating, guaranteed characters from each enabled type are spliced in and reshuffled — so every password always contains at least one of each selected type.

---

## ✦ Browser Support

| Browser | Support |
|---------|---------|
| Chrome 76+ | ✅ Full |
| Firefox 103+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 79+ | ✅ Full |

Requires `crypto.getRandomValues()` and `navigator.clipboard` — available in all modern browsers over HTTPS or localhost.

---

## ✦ Part of a Series

This is part of a growing collection of beautiful, zero-dependency web apps:

| Project | Description |
|---------|-------------|
| [Calculator](https://github.com/heyfaraninam/Calculator) | Glassmorphic calculator with 4 themes, scientific mode & history |
| [Notes](https://github.com/heyfaraninam/Notes) | Glassmorphic notes app with tags, pinning & instant search |
| [Weather](https://github.com/heyfaraninam/Weather) | Glassmorphic weather app with real-time data & 5-day forecast |
| [Typing Speed](https://github.com/heyfaraninam/typing-speed) | Glassmorphic typing speed test with WPM, stats & history |
| **Password Generator** | This project |

---

## ✦ Tags

`password-generator` `glassmorphism` `vanilla-js` `web-crypto-api` `dark-theme` `localstorage` `strength-meter` `html-css-js` `no-dependencies` `frontend`

---

## ✦ License

MIT — free to use, modify, and ship.

---

<div align="center">

Made with care · pure HTML · CSS · JS · no frameworks needed

</div>
