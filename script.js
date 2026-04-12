// ==========================================
// 1. GLOBAL VARIABLES
// ==========================================
let romData = [];
let filteredData = [];
let activeCategory = "All";
let activeSort = "name-asc";
const itemsPerPage = 6;
let currentlyDisplayed = 0;
let initialLoad = true;

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
        setTimeout(async function() {
            const response = await fetch('data.json');
            romData = await response.json();
            runFilter();
        }, 1000);
    } catch (error) {
        console.error("Failed to load data:", error);
        document.getElementById("romContainer").innerHTML = `<div class="no-results">Sorry, failed to load ROM data. ⚠️</div>`;
    }
}

function renderCards() {
    const container = document.getElementById("romContainer");
    const loadMoreBtn = document.getElementById("loadMoreContainer");

    if (filteredData.length === 0) {
        container.innerHTML = `<div class="no-results">Sorry, the ROM or device you are looking for is not available. 😢</div>`;
        loadMoreBtn.style.display = "none";
        return;
    }

    let endPoint = currentlyDisplayed + itemsPerPage;
    let dataToRender = filteredData.slice(currentlyDisplayed, endPoint);

    // KODE BARU: Keranjang sementara agar memori HP tidak crash!
    let tempHTML = ""; 

    for (let i = 0; i < dataToRender.length; i++) {
        let rom = dataToRender[i];
        let badgeClass = rom.type === "ROM" ? "badge-rom" : "badge-kernel";

        let gappsHtml = "";
        if (rom.type === "ROM") {
            if (rom.gapps) {
                gappsHtml = `<span class="spec-badge spec-green"><i class="fa-brands fa-google"></i> GApps Included</span>`;
            } else {
                gappsHtml = `<span class="spec-badge spec-grey">⚪ Vanilla (No GApps)</span>`;
            }
        }

        let safetyHtml = "";
        if (rom.type === "ROM") {
            if (rom.safetynet) {
                safetyHtml = `<span class="spec-badge spec-green">🛡️ SafetyNet Passed</span>`;
            } else {
                safetyHtml = `<span class="spec-badge spec-red">⚠️ SafetyNet Fails</span>`;
            }
        }

        let changelogList = "";
        if (rom.changelog && rom.changelog.length > 0) {
            for (let j = 0; j < rom.changelog.length; j++) {
                changelogList += `<li>${rom.changelog[j]}</li>`;
            }
        } else {
            changelogList = "<li>No changelog available.</li>";
        }

        let finalDownloadLink = rom.downloadLink;
        let excludeKeywords = ["eunjix.vercel.app", "t.me", "github.com", "sociabuzz.com", "pling.com", "sourceforge.net"];
        let shouldMonetize = true;

        for (let k = 0; k < excludeKeywords.length; k++) {
            if (finalDownloadLink.includes(excludeKeywords[k])) {
                shouldMonetize = false;
                break;
            }
        }

        if (shouldMonetize && finalDownloadLink !== "#") {
            let encodedUrl = encodeURIComponent(finalDownloadLink);
            finalDownloadLink = `https://sfl.gl/st?api=3ad571faff74debf487ee1375380cb041c3f4010&url=${encodedUrl}`;
        }

        let cardHTML = `
            <div class="card" id="${rom.md5}">
                <span class="badge ${badgeClass}">${rom.type}</span>
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-top: 5px;">
                    <h2 title="${rom.name}" style="margin-top: 0; flex: 1;">${rom.name}</h2>
                    <i class="fa-solid fa-share-nodes action-text" style="font-size: 1.2rem; padding-top: 2px;" onclick="copyCardLink('${rom.md5}')" title="Share direct link to this ROM"></i>
                </div>
                
                <div class="spec-container">
                    ${gappsHtml}
                    ${safetyHtml}
                </div>
                
                <div class="detail-item"><span>📱 Device</span> <strong title="${rom.device}">${rom.device}</strong></div>
                <div class="detail-item"><span>⚙️ Detail</span> <strong>${rom.category}</strong></div>
                <div class="detail-item"><span>👨‍💻 Maintainer</span> <strong>${rom.maintainer}</strong></div>
                <div class="detail-item"><span>📦 Size</span> <strong>${rom.size}</strong></div>
                <div class="detail-item">
                    <span>🛡️ MD5</span>
                    <span class="action-text" onclick="viewMD5(this, '${rom.md5}')" title="Click to view/copy">🔍 View MD5</span>
                </div>
                <div class="detail-item">
                    <span>📝 Changelog</span>
                    <span class="action-text" onclick="toggleChangelog(this)">🔽 View</span>
                </div>
                <div class="changelog-content" style="display: none;">
                    <ul>${changelogList}</ul>
                </div>
                <div class="card-actions">
                    <a href="${finalDownloadLink}" target="_blank" class="btn-download">⬇️ Download</a>
                    <button class="btn-share" onclick="copyLink('${finalDownloadLink}')">🔗 Copy Link</button>
                </div>
            </div>
        `;
        
        // KODE BARU: Simpan di keranjang, jangan langsung ke HTML
        tempHTML += cardHTML; 
    }

    // KODE BARU: Tumpahkan semua isi keranjang ke layar sekaligus (Sangat Cepat & Aman!)
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
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(function() {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

function viewMD5(buttonElement, hashMD5) {
    if (buttonElement.innerText === "🔍 View MD5") {
        buttonElement.innerText = hashMD5;
        buttonElement.style.fontFamily = "monospace";
        buttonElement.style.fontSize = "0.85rem";
        buttonElement.style.wordBreak = "break-all";
    } else {
        navigator.clipboard.writeText(hashMD5).then(function() {
            showToast("✅ MD5 Hash Copied!");
        });
    }
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(function() {
        showToast("✅ Download Link Copied!");
    });
}

function copyCardLink(hashId) {
    let cardUrl = window.location.origin + window.location.pathname + '#' + hashId;
    navigator.clipboard.writeText(cardUrl).then(function() {
        showToast("✅ Direct Card Link Copied!");
    });
}

function toggleChangelog(buttonElement) {
    let contentBox = buttonElement.parentElement.nextElementSibling;
    if (contentBox.style.display === "none") {
        contentBox.style.display = "block";
        buttonElement.innerText = "🔼 Hide";
    } else {
        contentBox.style.display = "none";
        buttonElement.innerText = "🔽 View";
    }
}

// ==========================================
// 4. MODALS & POPUPS
// ==========================================
function openModal() {
    document.getElementById("installModal").style.display = "block";
}
function closeModal() {
    document.getElementById("installModal").style.display = "none";
}
function openAboutModal(event) {
    event.preventDefault();
    document.getElementById("aboutModal").style.display = "block";
}
function closeAboutModal() {
    document.getElementById("aboutModal").style.display = "none";
}

window.onclick = function(event) {
    let installModal = document.getElementById("installModal");
    let aboutModal = document.getElementById("aboutModal");
    if (event.target == installModal) {
        installModal.style.display = "none";
    }
    if (event.target == aboutModal) {
        aboutModal.style.display = "none";
    }
}

// ==========================================
// 5. FILTER & SORTING LOGIC
// ==========================================
function changeCategory(buttonElement, category) {
    activeCategory = category;
    let allButtons = document.getElementsByClassName("btn-filter");
    for(let i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove("active");
    }
    buttonElement.classList.add("active");
    runFilter();
}

function changeSort(sortValue) {
    activeSort = sortValue;
    runFilter();
}

function parseSize(sizeStr) {
    let val = parseFloat(sizeStr);
    if (sizeStr.includes("GB")) return val * 1024;
    if (sizeStr.includes("MB")) return val;
    return 0;
}

function runFilter() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    
    filteredData = romData.filter(function(rom) {
        let textMatch = rom.name.toLowerCase().includes(input) || 
                        rom.device.toLowerCase().includes(input) || 
                        rom.maintainer.toLowerCase().includes(input);
        let categoryMatch = (activeCategory === "All") || (rom.type === activeCategory);
        return textMatch && categoryMatch;
    });
    
    filteredData.sort(function(a, b) {
        if (activeSort === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (activeSort === "size-asc") {
            return parseSize(a.size) - parseSize(b.size);
        } else if (activeSort === "size-desc") {
            return parseSize(b.size) - parseSize(a.size);
        }
    });
    
    currentlyDisplayed = 0;
    document.getElementById("romContainer").innerHTML = "";
    
    // KODE BARU: Pelindung Try-Catch agar web tidak blank jika link rusak
    try {
        if (initialLoad && window.location.hash) {
            // Decode URI berjaga-jaga jika WhatsApp/Telegram menambahkan karakter aneh
            let hash = decodeURIComponent(window.location.hash.substring(1));
            let targetIndex = filteredData.findIndex(rom => rom.md5 === hash);
            
            if (targetIndex !== -1) {
                while (currentlyDisplayed <= targetIndex) {
                    renderCards();
                }
                
                setTimeout(() => {
                    let targetCard = document.getElementById(hash);
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
    } catch (error) {
        console.error("Deep Link Error diselamatkan:", error);
    }
    
    initialLoad = false;
    renderCards();
}

// ==========================================
// 6. THEME & SCROLL
// ==========================================
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    let button = document.querySelector(".btn-toggle");
    if (document.body.classList.contains("dark-mode")) {
        button.innerHTML = "☀️ Light Mode";
    } else {
        button.innerHTML = "🌙 Dark Mode";
    }
}

window.onscroll = function() {
    let scrollButton = document.getElementById("btnScrollTop");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollButton.classList.add("show");
    } else {
        scrollButton.classList.remove("show");
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// 7. INITIALIZATION & PWA
// ==========================================
loadROMData();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js');
    });
}

// ==========================================
// 8. TYPEWRITER EFFECT
// ==========================================
const subtitleText = "The best place to download Custom ROMs and Kernels for your Android device.";
let textIndex = 0;
const typingSpeed = 40;

function typeWriterEffect() {
    if (textIndex < subtitleText.length) {
        document.getElementById("typewriter-text").innerHTML += subtitleText.charAt(textIndex);
        textIndex++;
        setTimeout(typeWriterEffect, typingSpeed);
    }
}

setTimeout(typeWriterEffect, 500);
