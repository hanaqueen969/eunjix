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
    
    // Generate 6 skeleton cards for loading effect
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
        // Simulating a slight network delay to showcase the skeleton UI
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

    // Handle empty state
    if (filteredData.length === 0) {
        container.innerHTML = `<div class="no-results">Sorry, the ROM or device you are looking for is not available. 😢</div>`;
        loadMoreBtn.style.display = "none";
        return;
    }

    const endPoint = currentlyDisplayed + itemsPerPage;
    const dataToRender = filteredData.slice(currentlyDisplayed, endPoint);

    // OPTIMIZATION: Temporary container to prevent mobile browser memory crash
    let tempHTML = ""; 

    for (let i = 0; i < dataToRender.length; i++) {
        const rom = dataToRender[i];
        const badgeClass = rom.type === "ROM" ? "badge-rom" : "badge-kernel";

        // GApps Badge Logic
        let gappsHtml = "";
        if (rom.type === "ROM") {
            if (rom.gapps) {
                gappsHtml = `<span class="spec-badge spec-green"><i class="fa-brands fa-google"></i> GApps Included</span>`;
            } else {
                gappsHtml = `<span class="spec-badge spec-grey">⚪ Vanilla (No GApps)</span>`;
            }
        }

        // SafetyNet Badge Logic
        let safetyHtml = "";
        if (rom.type === "ROM") {
            if (rom.safetynet) {
                safetyHtml = `<span class="spec-badge spec-green">🛡️ SafetyNet Passed</span>`;
            } else {
                safetyHtml = `<span class="spec-badge spec-red">⚠️ SafetyNet Fails</span>`;
            }
        }

        // Changelog Logic
        let changelogList = "";
        if (rom.changelog && rom.changelog.length > 0) {
            for (let j = 0; j < rom.changelog.length; j++) {
                changelogList += `<li>${rom.changelog[j]}</li>`;
            }
        } else {
            changelogList = "<li>No changelog available.</li>";
        }

        // Monetization Logic (Safeguard external links)
        let finalDownloadLink = rom.downloadLink;
        const excludeKeywords = ["eunjix.vercel.app", "t.me", "github.com", "sociabuzz.com", "pling.com", "sourceforge.net"];
        let shouldMonetize = true;

        for (let k = 0; k < excludeKeywords.length; k++) {
            if (finalDownloadLink.includes(excludeKeywords[k])) {
                shouldMonetize = false;
                break;
            }
        }

        if (shouldMonetize && finalDownloadLink !== "#") {
            const encodedUrl = encodeURIComponent(finalDownloadLink);
            finalDownloadLink = `https://sfl.gl/st?api=3ad571faff74debf487ee1375380cb041c3f4010&url=${encodedUrl}`;
        }

        // Card HTML Structure
        const cardHTML = `
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
        
        // Store in temporary container instead of writing directly to the DOM
        tempHTML += cardHTML; 
    }

    // Inject all compiled cards into the DOM at once (High Performance & Safe)
    container.insertAdjacentHTML('beforeend', tempHTML);

    currentlyDisplayed += dataToRender.length;

    // Toggle "Load More" button visibility
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
    const cardUrl = window.location.origin + window.location.pathname + '#' + hashId;
    navigator.clipboard.writeText(cardUrl).then(function() {
        showToast("✅ Direct Card Link Copied!");
    });
}

function toggleChangelog(buttonElement) {
    const contentBox = buttonElement.parentElement.nextElementSibling;
    
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

// Close modals when clicking outside of them
window.addEventListener('click', function(event) {
    const installModal = document.getElementById("installModal");
    const aboutModal = document.getElementById("aboutModal");
    
    if (event.target === installModal) {
        installModal.style.display = "none";
    }
    if (event.target === aboutModal) {
        aboutModal.style.display = "none";
    }
});

// ==========================================
// 5. FILTER & SORTING LOGIC
// ==========================================
function changeCategory(buttonElement, category) {
    activeCategory = category;
    
    const allButtons = document.getElementsByClassName("btn-filter");
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
    const val = parseFloat(sizeStr);
    if (sizeStr.includes("GB")) return val * 1024;
    if (sizeStr.includes("MB")) return val;
    return 0;
}

function runFilter() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    
    filteredData = romData.filter(function(rom) {
        const textMatch = rom.name.toLowerCase().includes(input) || 
                        rom.device.toLowerCase().includes(input) || 
                        rom.maintainer.toLowerCase().includes(input);
        const categoryMatch = (activeCategory === "All") || (rom.type === activeCategory);
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
    
    // SAFEGUARD: Deep Link handling with try-catch
    try {
        if (initialLoad && window.location.hash) {
            // Decode URI in case WhatsApp/Telegram appends unusual characters
            const hash = decodeURIComponent(window.location.hash.substring(1));
            const targetIndex = filteredData.findIndex(rom => rom.md5 === hash);
            
            if (targetIndex !== -1) {
                // Render enough cards to display the target card
                while (currentlyDisplayed <= targetIndex) {
                    renderCards();
                }
                
                // Scroll to the card and apply a highlighting effect
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
    } catch (error) {
        console.error("Deep link error caught and handled:", error);
    }
    
    initialLoad = false;
    renderCards();
}

// ==========================================
// 6. THEME & SCROLL LOGIC
// ==========================================
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const button = document.querySelector(".btn-toggle");
    
    if (document.body.classList.contains("dark-mode")) {
        button.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
    } else {
        button.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
    }
}

window.addEventListener('scroll', function() {
    const scrollButton = document.getElementById("btnScrollTop");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollButton.classList.add("show");
    } else {
        scrollButton.classList.remove("show");
    }
});

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

// Start typewriter effect after a short delay
setTimeout(typeWriterEffect, 500);

// ==========================================
// 9. LANGUAGE TRANSLATION (i18n)
// ==========================================
let currentLang = "EN"; // Default website language

// Dictionary for UI Translation
const uiTranslations = {
    "EN": {
        "btnLang": '<i class="fa-solid fa-globe"></i> ID',
        "searchPlaceholder": "Search device, ROM, or maintainer...",
        "toastMessage": "✅ Language changed to English!"
    },
    "ID": {
        "btnLang": '<i class="fa-solid fa-globe"></i> EN',
        "searchPlaceholder": "Cari perangkat, ROM, atau maintainer...",
        "toastMessage": "✅ Bahasa diubah ke Indonesia!"
    }
};

function toggleLanguage() {
    // Switch the active language state
    currentLang = currentLang === "EN" ? "ID" : "EN";
    
    // 1. Update the language button text
    document.getElementById("btnLang").innerHTML = uiTranslations[currentLang]["btnLang"];
    
    // 2. Update the search bar placeholder
    document.getElementById("searchInput").placeholder = uiTranslations[currentLang]["searchPlaceholder"];
    
    // 3. Show a notification
    showToast(uiTranslations[currentLang]["toastMessage"]);
    
    /* NOTE FOR DEVELOPER: 
       To translate other elements (like buttons or titles), 
       add an ID to the HTML element (e.g., id="installBtn"),
       add the translation strings to the dictionary above, 
       and update them here using document.getElementById().innerHTML 
    */
}
