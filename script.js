// ==========================================
// 1. GLOBAL VARIABLES & TRANSLATION (i18n)
// ==========================================
let romData = [];
let filteredData = [];
let activeCategory = "All";
let activeSort = "name-asc";
const itemsPerPage = 6;
let currentlyDisplayed = 0;
let initialLoad = true;

// REPAIRED: Check browser memory right from the start, default to "EN"
let currentLang = localStorage.getItem("eunjix_lang") || "EN"; 

// The Giant Digital Dictionary
const uiTranslations = {
    "EN": {
        "btnLang": '<i class="fa-solid fa-globe"></i> ID',
        "subtitle": "The best place to download Custom ROMs and Kernels for your Android device.",
        "btnInstall": '<i class="fa-solid fa-book-open"></i> How to Install',
        "btnSupport": '<i class="fa-solid fa-mug-hot"></i> Support Me',
        "btnThemeDark": '<i class="fa-solid fa-moon"></i> Dark Mode',
        "btnThemeLight": '<i class="fa-solid fa-sun"></i> Light Mode',
        "disclaimer": '<strong>⚠️ Disclaimer:</strong> We are not responsible for bricked devices, dead SD cards, or data loss. Flash at your own risk!',
        "searchPlaceholder": "Search device, ROM, or maintainer...",
        "filterAll": "All",
        "filterRom": "ROM Only",
        "filterKernel": "Kernel Only",
        "sortAZ": "A to Z",
        "sortSmall": "Size: Small to Large",
        "sortLarge": "Size: Large to Small",
        "adLabel": "Advertisement",
        "commentsTitle": "💬 Community Discussion",
        "commentsDesc": "Leave a comment, report bugs, or say hello to the developer!",
        "footerText": "&copy; 2026 EunjiX. All rights reserved.",
        "btnAbout": '<i class="fa-solid fa-user-astronaut"></i> About Me',
        "btnLoadMore": '<i class="fa-solid fa-arrows-rotate"></i> Load More',
        "modalGuideTitle": "📖 Flashing Guide",
        "modalGuideWarn": "<strong>⚠️ Warning:</strong> Backup your data before flashing!",
        "modalGuideSteps": `
            <li>Reboot to Custom Recovery (TWRP / OrangeFox).</li>
            <li>Wipe Data, Cache, System, Vendor and Dalvik Cache.</li>
            <li>Flash the ROM zip file.</li>
            <li>Flash the GApps zip file (if Vanilla build).</li>
            <li>Format Data (if changing ROM from FBE base).</li>
            <li>Reboot System and enjoy!</li>
        `,
        "modalAboutTitle": "👨‍💻 About Developer",
        "modalAboutRole": "Android Developer & ROM Maintainer",
        "modalAboutBio": "Hi! I am a passionate developer who loves tinkering with Android. I dedicate my free time to building stable, smooth, and battery-friendly Kernel and Custom ROMs for the community.",
        // Card Strings
        "cardGapps": '<i class="fa-brands fa-google"></i> GApps Included',
        "cardVanilla": '⚪ Vanilla (No GApps)',
        "cardSafetyPass": '🛡️ SafetyNet Passed',
        "cardSafetyFail": '⚠️ SafetyNet Fails',
        "cardNoChangelog": '<li>No changelog available.</li>',
        "cardDevice": '<span>📱 Device</span>',
        "cardDetail": '<span>⚙️ Detail</span>',
        "cardMaintainer": '<span>👨‍💻 Maintainer</span>',
        "cardSize": '<span>📦 Size</span>',
        "cardMD5": '<span>🛡️ MD5</span>',
        "cardChangelog": '<span>📝 Changelog</span>',
        "btnView": '🔍 View MD5',
        "btnViewChangelog": '🔽 View',
        "btnHideChangelog": '🔼 Hide',
        "btnDownload": '⬇️ Download',
        "btnCopyLink": '🔗 Copy Link',
        "toastMD5": "✅ MD5 Hash Copied!",
        "toastLink": "✅ Download Link Copied!",
        "toastDirect": "✅ Direct Card Link Copied!",
        "toastLang": "✅ Language changed to English!",
        "noResults": "Sorry, the ROM or device you are looking for is not available. 😢"
    },
    "ID": {
        "btnLang": '<i class="fa-solid fa-globe"></i> EN',
        "subtitle": "Tempat terbaik untuk mengunduh Custom ROM dan Kernel untuk perangkat Android Anda.",
        "btnInstall": '<i class="fa-solid fa-book-open"></i> Cara Pasang',
        "btnSupport": '<i class="fa-solid fa-mug-hot"></i> Dukung Saya',
        "btnThemeDark": '<i class="fa-solid fa-moon"></i> Mode Gelap',
        "btnThemeLight": '<i class="fa-solid fa-sun"></i> Mode Terang',
        "disclaimer": '<strong>⚠️ Peringatan:</strong> Kami tidak bertanggung jawab atas perangkat brick, SD card rusak, atau data hilang. Tanggung risiko sendiri!',
        "searchPlaceholder": "Cari perangkat, ROM, atau maintainer...",
        "filterAll": "Semua",
        "filterRom": "Hanya ROM",
        "filterKernel": "Hanya Kernel",
        "sortAZ": "A ke Z",
        "sortSmall": "Ukuran: Kecil ke Besar",
        "sortLarge": "Ukuran: Besar ke Kecil",
        "adLabel": "Iklan",
        "commentsTitle": "💬 Diskusi Komunitas",
        "commentsDesc": "Tinggalkan komentar, laporkan bug, atau sapa developer!",
        "footerText": "&copy; 2026 EunjiX. Hak Cipta Dilindungi.",
        "btnAbout": '<i class="fa-solid fa-user-astronaut"></i> Tentang Saya',
        "btnLoadMore": '<i class="fa-solid fa-arrows-rotate"></i> Muat Lagi',
        "modalGuideTitle": "📖 Panduan Flashing",
        "modalGuideWarn": "<strong>⚠️ Peringatan:</strong> Cadangkan data Anda sebelum flashing!",
        "modalGuideSteps": `
            <li>Reboot ke Custom Recovery (TWRP / OrangeFox).</li>
            <li>Wipe Data, Cache, System, Vendor, dan Dalvik Cache.</li>
            <li>Flash file zip ROM.</li>
            <li>Flash file zip GApps (jika versi Vanilla).</li>
            <li>Format Data (jika ganti ROM dari basis FBE).</li>
            <li>Reboot Sistem dan nikmati!</li>
        `,
        "modalAboutTitle": "👨‍💻 Tentang Developer",
        "modalAboutRole": "Developer Android & Maintainer ROM",
        "modalAboutBio": "Hai! Saya adalah pengembang yang suka mengoprek Android. Saya mendedikasikan waktu luang saya untuk membuat Kernel dan Custom ROM yang stabil, mulus, dan hemat baterai untuk komunitas.",
        // Card Strings
        "cardGapps": '<i class="fa-brands fa-google"></i> Termasuk GApps',
        "cardVanilla": '⚪ Vanilla (Tanpa GApps)',
        "cardSafetyPass": '🛡️ SafetyNet Lolos',
        "cardSafetyFail": '⚠️ SafetyNet Gagal',
        "cardNoChangelog": '<li>Catatan perubahan tidak tersedia.</li>',
        "cardDevice": '<span>📱 Perangkat</span>',
        "cardDetail": '<span>⚙️ Detail</span>',
        "cardMaintainer": '<span>👨‍💻 Pengelola</span>',
        "cardSize": '<span>📦 Ukuran</span>',
        "cardMD5": '<span>🛡️ MD5</span>',
        "cardChangelog": '<span>📝 Pembaruan</span>',
        "btnView": '🔍 Lihat MD5',
        "btnViewChangelog": '🔽 Lihat',
        "btnHideChangelog": '🔼 Tutup',
        "btnDownload": '⬇️ Unduh',
        "btnCopyLink": '🔗 Salin Tautan',
        "toastMD5": "✅ Hash MD5 Disalin!",
        "toastLink": "✅ Tautan Unduhan Disalin!",
        "toastDirect": "✅ Tautan Langsung Kartu Disalin!",
        "toastLang": "✅ Bahasa diubah ke Indonesia!",
        "noResults": "Maaf, ROM atau perangkat yang Anda cari tidak tersedia. 😢"
    }
};

// ==========================================
// 2. DATA FETCHING & RENDERING
// ==========================================
function showSkeleton() {
    const container = document.getElementById("romContainer");
    container.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        container.innerHTML += `
            <div class="skeleton-card">
                <div class="skeleton-line skeleton-badge"></div>
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text short"></div>
            </div>
        `;
    }
}

async function loadROMData() {
    showSkeleton();
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch('data.json');
        romData = await response.json();
        runFilter();
    } catch (error) {
        console.error("Failed to load data:", error);
        document.getElementById("romContainer").innerHTML = `<div class="no-results">Sorry, failed to load ROM data. ⚠️</div>`;
    }
}

function renderCards() {
    const container = document.getElementById("romContainer");
    const loadMoreBtn = document.getElementById("loadMoreContainer");
    const dict = uiTranslations[currentLang]; // Active dictionary

    if (filteredData.length === 0) {
        container.innerHTML = `<div class="no-results">${dict["noResults"]}</div>`;
        loadMoreBtn.style.display = "none";
        return;
    }

    const endPoint = currentlyDisplayed + itemsPerPage;
    const dataToRender = filteredData.slice(currentlyDisplayed, endPoint);
    let tempHTML = ""; 

    for (let i = 0; i < dataToRender.length; i++) {
        const rom = dataToRender[i];
        const badgeClass = rom.type === "ROM" ? "badge-rom" : "badge-kernel";

        let gappsHtml = "";
        if (rom.type === "ROM") {
            if (rom.gapps) {
                gappsHtml = `<span class="spec-badge spec-green">${dict["cardGapps"]}</span>`;
            } else {
                gappsHtml = `<span class="spec-badge spec-grey">${dict["cardVanilla"]}</span>`;
            }
        }

        let safetyHtml = "";
        if (rom.type === "ROM") {
            if (rom.safetynet) {
                safetyHtml = `<span class="spec-badge spec-green">${dict["cardSafetyPass"]}</span>`;
            } else {
                safetyHtml = `<span class="spec-badge spec-red">${dict["cardSafetyFail"]}</span>`;
            }
        }

        let changelogList = "";
        if (rom.changelog && rom.changelog.length > 0) {
            for (let j = 0; j < rom.changelog.length; j++) {
                changelogList += `<li>${rom.changelog[j]}</li>`;
            }
        } else {
            changelogList = dict["cardNoChangelog"];
        }

        let finalDownloadLink = rom.downloadLink;
        const excludeKeywords = ["eunjix.vercel.app", "t.me", "github.com", "sociabuzz.com", "pling.com", "sourceforge.net"];
        let shouldMonetize = true;

        for (let k = 0; k < excludeKeywords.length; k++) {
            if (finalDownloadLink.includes(excludeKeywords[k])) {
                shouldMonetize = false; break;
            }
        }

        if (shouldMonetize && finalDownloadLink !== "#") {
            const encodedUrl = encodeURIComponent(finalDownloadLink);
            finalDownloadLink = `https://sfl.gl/st?api=3ad571faff74debf487ee1375380cb041c3f4010&url=${encodedUrl}`;
        }

        const cardHTML = `
            <div class="card" id="${rom.md5}">
                <span class="badge ${badgeClass}">${rom.type}</span>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-top: 5px;">
                    <h2 title="${rom.name}" style="margin-top: 0; flex: 1;">${rom.name}</h2>
                    <i class="fa-solid fa-share-nodes action-text" style="font-size: 1.2rem; padding-top: 2px;" onclick="copyCardLink('${rom.md5}')" title="Share link"></i>
                </div>
                <div class="spec-container">
                    ${gappsHtml}
                    ${safetyHtml}
                </div>
                <div class="detail-item">${dict["cardDevice"]} <strong title="${rom.device}">${rom.device}</strong></div>
                <div class="detail-item">${dict["cardDetail"]} <strong>${rom.category}</strong></div>
                <div class="detail-item">${dict["cardMaintainer"]} <strong>${rom.maintainer}</strong></div>
                <div class="detail-item">${dict["cardSize"]} <strong>${rom.size}</strong></div>
                <div class="detail-item">
                    ${dict["cardMD5"]}
                    <span class="action-text" onclick="viewMD5(this, '${rom.md5}')">${dict["btnView"]}</span>
                </div>
                <div class="detail-item">
                    ${dict["cardChangelog"]}
                    <span class="action-text" onclick="toggleChangelog(this)">${dict["btnViewChangelog"]}</span>
                </div>
                <div class="changelog-content" style="display: none;">
                    <ul>${changelogList}</ul>
                </div>
                <div class="card-actions">
                    <a href="${finalDownloadLink}" target="_blank" class="btn-download">${dict["btnDownload"]}</a>
                    <button class="btn-share" onclick="copyLink('${finalDownloadLink}')">${dict["btnCopyLink"]}</button>
                </div>
            </div>
        `;
        tempHTML += cardHTML; 
    }

    container.insertAdjacentHTML('beforeend', tempHTML);
    currentlyDisplayed += dataToRender.length;

    if (currentlyDisplayed < filteredData.length) {
        loadMoreBtn.style.display = "block";
    } else {
        loadMoreBtn.style.display = "none";
    }
}

function loadMore() {
    const btn = document.getElementById("loadMoreBtn");
    const spinner = document.getElementById("loadingSpinner");
    btn.style.display = "none";
    spinner.style.display = "block";
    
    setTimeout(function() {
        renderCards();
        spinner.style.display = "none";
        if (currentlyDisplayed < filteredData.length) {
            btn.style.display = "inline-block";
        }
    }, 800);
}

// ==========================================
// 3. UI INTERACTIONS & TOAST
// ==========================================
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(function() { toast.className = toast.className.replace("show", ""); }, 3000);
}

function viewMD5(buttonElement, hashMD5) {
    const dict = uiTranslations[currentLang];
    if (buttonElement.innerText === dict["btnView"].replace(/<[^>]*>?/gm, '').trim()) {
        buttonElement.innerText = hashMD5;
        buttonElement.style.fontFamily = "monospace";
        buttonElement.style.fontSize = "0.85rem";
        buttonElement.style.wordBreak = "break-all";
    } else {
        navigator.clipboard.writeText(hashMD5).then(function() { showToast(dict["toastMD5"]); });
    }
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(function() { showToast(uiTranslations[currentLang]["toastLink"]); });
}

function copyCardLink(hashId) {
    const cardUrl = window.location.origin + window.location.pathname + '#' + hashId;
    navigator.clipboard.writeText(cardUrl).then(function() { showToast(uiTranslations[currentLang]["toastDirect"]); });
}

function toggleChangelog(buttonElement) {
    const contentBox = buttonElement.parentElement.nextElementSibling;
    const dict = uiTranslations[currentLang];
    
    if (contentBox.style.display === "none") {
        contentBox.style.display = "block";
        buttonElement.innerText = dict["btnHideChangelog"];
    } else {
        contentBox.style.display = "none";
        buttonElement.innerText = dict["btnViewChangelog"];
    }
}

// ==========================================
// 4. MODALS & POPUPS
// ==========================================
function openModal() { document.getElementById("installModal").style.display = "block"; }
function closeModal() { document.getElementById("installModal").style.display = "none"; }
function openAboutModal(event) { event.preventDefault(); document.getElementById("aboutModal").style.display = "block"; }
function closeAboutModal() { document.getElementById("aboutModal").style.display = "none"; }

window.addEventListener('click', function(event) {
    const installModal = document.getElementById("installModal");
    const aboutModal = document.getElementById("aboutModal");
    if (event.target === installModal) installModal.style.display = "none";
    if (event.target === aboutModal) aboutModal.style.display = "none";
});

// ==========================================
// 5. FILTER & SORTING LOGIC
// ==========================================
function changeCategory(buttonElement, category) {
    activeCategory = category;
    const allButtons = document.getElementsByClassName("btn-filter");
    for(let i = 0; i < allButtons.length; i++) allButtons[i].classList.remove("active");
    buttonElement.classList.add("active");
    runFilter();
}

function changeSort(sortValue) {
    activeSort = sortValue;
    runFilter();
}

function parseSize(sizeStr) {
    const val = parseFloat(sizeStr);
    if (sizeStr.includes("GB")) return val * 1024;
    if (sizeStr.includes("MB")) return val;
    return 0;
}

function runFilter() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    
    filteredData = romData.filter(function(rom) {
        const textMatch = rom.name.toLowerCase().includes(input) || rom.device.toLowerCase().includes(input) || rom.maintainer.toLowerCase().includes(input);
        const categoryMatch = (activeCategory === "All") || (rom.type === activeCategory);
        return textMatch && categoryMatch;
    });
    
    filteredData.sort(function(a, b) {
        if (activeSort === "name-asc") return a.name.localeCompare(b.name);
        else if (activeSort === "size-asc") return parseSize(a.size) - parseSize(b.size);
        else if (activeSort === "size-desc") return parseSize(b.size) - parseSize(a.size);
    });
    
    currentlyDisplayed = 0;
    document.getElementById("romContainer").innerHTML = "";
    
    try {
        if (initialLoad && window.location.hash) {
            const hash = decodeURIComponent(window.location.hash.substring(1));
            const targetIndex = filteredData.findIndex(rom => rom.md5 === hash);
            if (targetIndex !== -1) {
                while (currentlyDisplayed <= targetIndex) renderCards();
                setTimeout(() => {
                    const targetCard = document.getElementById(hash);
                    if (targetCard) {
                        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetCard.style.transition = "box-shadow 0.5s ease";
                        targetCard.style.boxShadow = "0 0 25px var(--md-primary)";
                        setTimeout(() => { targetCard.style.boxShadow = "none"; }, 3000);
                    }
                }, 800);
                initialLoad = false;
                return;
            }
        }
    } catch (error) { console.error("Deep link error:", error); }
    
    initialLoad = false;
    renderCards();
}

// ==========================================
// 6. THEME, SCROLL & LANGUAGE (WITH LOCAL STORAGE)
// ==========================================

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const button = document.querySelector(".btn-toggle");
    const dict = uiTranslations[currentLang];
    
    // Save theme preference to local storage
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("eunjix_theme", isDarkMode ? "dark" : "light");
    
    if (isDarkMode) {
        button.innerHTML = dict["btnThemeLight"];
    } else {
        button.innerHTML = dict["btnThemeDark"];
    }
}

// Function to apply translation to the entire UI
function applyTranslationUI(showNotification = true) {
    const dict = uiTranslations[currentLang];
    
    // 1. Translate UI elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    // 2. Translate special inputs (Search Bar)
    document.getElementById("searchInput").placeholder = dict["searchPlaceholder"];
    
    // 3. Translate Theme Button based on current theme state
    const themeBtn = document.querySelector(".btn-toggle");
    if (document.body.classList.contains("dark-mode")) {
        themeBtn.innerHTML = dict["btnThemeLight"];
    } else {
        themeBtn.innerHTML = dict["btnThemeDark"];
    }

    // 4. Reset & Restart Typewriter Effect for new language
    document.getElementById("typewriter-text").innerHTML = "";
    textIndex = 0;
    clearTimeout(typewriterTimeout);
    typeWriterEffect();

    // 5. Re-render Cards to apply translation to card elements
    document.getElementById("romContainer").innerHTML = "";
    currentlyDisplayed = 0;
    renderCards();

    // 6. Show confirmation toast ONLY when button is clicked
    if (showNotification) {
        showToast(dict["toastLang"]);
    }
}

function toggleLanguage() {
    // Switch the active language
    currentLang = currentLang === "EN" ? "ID" : "EN";
    
    // Save the choice to browser's long-term memory
    localStorage.setItem("eunjix_lang", currentLang);
    
    // Apply changes and show notification
    applyTranslationUI(true);
}

window.addEventListener('scroll', function() {
    const scrollButton = document.getElementById("btnScrollTop");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollButton.classList.add("show");
    } else {
        scrollButton.classList.remove("show");
    }
});

function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }

// ==========================================
// 7. INITIALIZATION & PWA
// ==========================================

// Apply saved theme on page load (Must execute before rendering cards)
if (localStorage.getItem("eunjix_theme") === "light") {
    document.body.classList.remove("dark-mode");
}

// Apply saved language on page load (without showing popup)
if (currentLang !== "EN") {
    // Wait slightly for DOM to be ready before applying translations
    window.addEventListener('DOMContentLoaded', (event) => {
        applyTranslationUI(false);
    });
}

loadROMData();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js');
    });
}

// ==========================================
// 8. TYPEWRITER EFFECT
// ==========================================
let textIndex = 0;
const typingSpeed = 40;
let typewriterTimeout;

function typeWriterEffect() {
    const subtitleText = uiTranslations[currentLang]["subtitle"];
    if (textIndex < subtitleText.length) {
        document.getElementById("typewriter-text").innerHTML += subtitleText.charAt(textIndex);
        textIndex++;
        typewriterTimeout = setTimeout(typeWriterEffect, typingSpeed);
    }
}
typewriterTimeout = setTimeout(typeWriterEffect, 500);
