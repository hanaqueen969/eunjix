# EunjiX - Custom ROM & Kernel Repository

![EunjiX Preview](https://img.shields.io/badge/Platform-Web%20App-6750A4?style=for-the-badge&logo=appveyor)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-success?style=for-the-badge&logo=pwa)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

Welcome to the official web repository for **EunjiX**, a blazing-fast, modern, and beautifully designed Single Page Application (SPA) built to host and distribute Custom ROMs and Kernels for Android devices.

🌐 **Live Demo:** [Visit EunjiX Repository](https://eunjix.vercel.app/)

---

## ✨ Key Features
This website is built with a focus on UI/UX, mimicking the native Android Material You design language.
- **Material You Design:** Dynamic colors, rounded corners, and smooth transitions.
- **Progressive Web App (PWA):** Installable on Android, iOS, and Desktop. Works seamlessly offline!
- **Deep Linking:** Share a specific ROM card directly using the `MD5` hash URL.
- **Skeleton Loading:** Premium shimmer loading effects for slower internet connections.
- **Advanced Filtering:** Instantly search by device code, maintainer, or sort by file size.
- **Auto-Monetization:** Integrated ad-network and URL shortener support out of the box.
- **Dark Mode:** Native dark mode with zero layout shift.

## 🛠️ Tech Stack
This project is deliberately built using **Vanilla Web Technologies** for maximum speed and zero dependencies:
- **HTML5:** Semantic and accessible structure.
- **CSS3:** Custom CSS Variables, Flexbox, Grid, and Keyframe Animations.
- **Vanilla JavaScript (ES6):** Fast asynchronous data fetching and DOM manipulation without heavy frameworks like React or Vue.
- **JSON:** Acting as a lightweight, scalable, and easy-to-update database.

## 🚀 How to Add New ROMs (For Maintainers)
Updating the website with a new ROM release is incredibly simple. You don't need to touch the HTML or JS.

1. Open the `data.json` file.
2. Add a new block for your release:
```json
{
    "name": "ROM_NAME",
    "device": "Asus Zenfone Max Pro M1 (X00TD)",
    "type": "ROM",
    "category": "Android 16",
    "maintainer": "EunjiX",
    "size": "1.8 GB",
    "downloadLink": "YOUR_DOWNLOAD_LINK_HERE",
    "md5": "UNIQUE_MD5_HASH",
    "gapps": true,
    "safetynet": true,
    "changelog": [
        "Initial Android 16 release",
        "Updated kernel upstream"
    ]
}
