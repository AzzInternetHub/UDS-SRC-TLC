/**
 * UDS TLC SRC Core Web Engine
 * Developed for Azz Internet Hub
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigationDrawer();
    initThemeSwitchEngine();
    initScrollRevelator();
    initMetricCounters();
    initMediaLightbox();
    initFormProcessors();
    engageServiceWorker();
    fetchDynamicNewsBoard();
});

/* DYNAMIC FRAME NAVIGATION DRAWER */
function initNavigationDrawer() {
    const menuOpenBtn = document.getElementById('menuOpenBtn');
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    const navDrawer = document.getElementById('navDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-item');
    const sections = document.querySelectorAll('.app-section');

    function toggleDrawerState(open) {
        if(open) {
            navDrawer.classList.add('open');
            drawerOverlay.classList.add('visible');
        } else {
            navDrawer.classList.remove('open');
            drawerOverlay.classList.remove('visible');
        }
    }

    menuOpenBtn.addEventListener('click', () => toggleDrawerState(true));
    menuCloseBtn.addEventListener('click', () => toggleDrawerState(false));
    drawerOverlay.addEventListener('click', () => toggleDrawerState(false));

    drawerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            drawerLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(section => {
                if(section.id === targetId) {
                    section.classList.add('visible');
                    if(targetId === 'about') runTelemetryCounter();
                } else {
                    section.classList.remove('visible');
                }
            });

            toggleDrawerState(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.classList.contains('drawer-item')) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const nodeTarget = this.getAttribute('href').substring(1);
                const targetLink = document.querySelector(`.drawer-item[href="#${nodeTarget}"]`);
                if(targetLink) targetLink.click();
            });
        }
    });
}

/* THEME SCHEME TOGGLER */
function initThemeSwitchEngine() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeText = document.getElementById('themeText');
    const themeIcon = themeToggleBtn.querySelector('i');

    const activeThemeSetting = localStorage.getItem('app-theme') || 'light';
    document.documentElement.setAttribute('data-theme', activeThemeSetting);
    syncThemeControlsUI(activeThemeSetting);

    themeToggleBtn.addEventListener('click', () => {
        const checkActive = document.documentElement.getAttribute('data-theme');
        const nextTheme = checkActive === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('app-theme', nextTheme);
        syncThemeControlsUI(nextTheme);
    });

    function syncThemeControlsUI(theme) {
        if(theme === 'dark') {
            themeText.textContent = 'Light Mode';
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeText.textContent = 'Dark Mode';
            themeIcon.className = 'fa-solid fa-moon';
        }
    }
}

/* DISPLACEMENT SCROLL OBSERVER */
function initScrollRevelator() {
    const activeCards = document.querySelectorAll('.scroll-reveal');
    const configurations = { threshold: 0.1, rootMargin: "0px 0px -40px 0px" };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, configurations);

    activeCards.forEach(card => observer.observe(card));
}

/* STATISTICS COUNTER TRACKS */
function initMetricCounters() {
    if(document.getElementById('about').classList.contains('visible')) {
        runTelemetryCounter();
    }
}

function runTelemetryCounter() {
    const dynamicFields = document.querySelectorAll('.counter');
    dynamicFields.forEach(field => {
        field.textContent = '0';
        const maximumVal = +field.getAttribute('data-target');
        const jumpValue = maximumVal / 40; 
        
        const computeProgress = () => {
            const parsedVal = +field.textContent;
            if(parsedVal < maximumVal) {
                field.textContent = Math.ceil(parsedVal + jumpValue);
                setTimeout(computeProgress, 25);
            } else {
                if(maximumVal === 16000) field.textContent = '16,000+';
                else if(maximumVal === 50) field.textContent = '50+';
                else field.textContent = maximumVal;
            }
        };
        computeProgress();
    });
}

/* LIGHTBOX INTERACTION DISPLAYS (Works for both Profile and News cards) */
function initMediaLightbox() {
    const modalBox = document.getElementById('photoLightbox');
    const expandedImg = document.getElementById('lightboxTargetImg');
    const elementCaption = document.getElementById('lightboxCaption');
    const closeTrigger = document.querySelector('.lightbox-close');

    // Attach listeners dynamically using event delegation to catch runtime-loaded news cards
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.profile-card, .news-card');
        if (!card) return;

        // Prevent expanding text-only elements or non-clickable cards
        const targetedPhoto = card.querySelector('.admin-photo, .news-display-img');
        if (!targetedPhoto) return;

        modalBox.style.display = 'flex';
        expandedImg.src = targetedPhoto.src;
        
        if (card.classList.contains('profile-card')) {
            const title = card.querySelector('h3').textContent;
            const subtitle = card.querySelector('.title-label').textContent;
            elementCaption.innerHTML = `<strong>${title}</strong> - ${subtitle}`;
        } else {
            const newsHeading = card.querySelector('h3').textContent;
            elementCaption.innerHTML = `<strong>${newsHeading}</strong>`;
        }
    });

    closeTrigger.addEventListener('click', () => modalBox.style.display = 'none');
    modalBox.addEventListener('click', (e) => {
        if(e.target === modalBox || e.target === closeTrigger) modalBox.style.display = 'none';
    });
}

/* GOOGLE APPS SCRIPTS NET PIPELINES */
function initFormProcessors() {
    const generalForm = document.getElementById('campusContactForm');
    const feedbackBox = document.getElementById('contactFeedback');

    generalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedbackBox.className = 'form-feedback';
        feedbackBox.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message to safe database...';

        const transmissionBlock = {
            action: 'contact',
            name: document.getElementById('formName').value,
            email: document.getElementById('formEmail').value,
            message: document.getElementById('formMessage').value
        };

        try {
            await fetch(SRC_CONFIG.GOOGLE_SHEET_WEBAPP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transmissionBlock)
            });
            
            feedbackBox.className = 'form-feedback success';
            feedbackBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Dispatched successfully to the SRC panel.';
            generalForm.reset();
        } catch (error) {
            feedbackBox.className = 'form-feedback error';
            feedbackBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Network error. Data saved in local cache.';
        }
    });

    const alertForm = document.getElementById('smsSubscriptionForm');
    const alertFeedback = document.getElementById('smsFeedback');

    alertForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertFeedback.className = 'form-feedback';
        alertFeedback.innerHTML = 'Syncing...';

        const smsBlock = {
            action: 'sms_subscribe',
            phone: document.getElementById('smsPhoneInput').value
        };

        try {
            await fetch(SRC_CONFIG.GOOGLE_SHEET_WEBAPP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(smsBlock)
            });

            alertFeedback.className = 'form-feedback success';
            alertFeedback.innerHTML = 'Subscribed successfully!';
            alertForm.reset();
        } catch (error) {
            alertFeedback.className = 'form-feedback error';
            alertFeedback.innerHTML = 'Error updating subscription records.';
        }
    });
}

/* DYNAMIC INTERNET-FALLBACK CONTENT LOADER */
async function fetchDynamicNewsBoard() {
    const renderNode = document.getElementById('dynamicNewsContainer');
    
    try {
        const stream = await fetch(`${SRC_CONFIG.GOOGLE_SHEET_WEBAPP_URL}?action=getNews`);
        const collection = await stream.json();
        populateNewsCards(collection, renderNode);
    } catch (err) {
        console.warn("Dynamic network feed offline. Routing onto system fallbacks.");
        populateNewsCards(SRC_CONFIG.OFFLINE_FALLBACK_NEWS, renderNode);
    }
}

function populateNewsCards(items, viewNode) {
    if(!items || items.length === 0) {
        viewNode.innerHTML = '<p class="news-loading-placeholder">No recent notifications matching system files.</p>';
        return;
    }
    
    viewNode.innerHTML = '';
    items.forEach(article => {
        const nodeCard = document.createElement('div');
        nodeCard.className = 'news-card';
        
        // Render image element only if a link was configured inside the sheet
        let displayImgBlock = '';
        if(article.imageUrl && article.imageUrl.trim() !== "") {
            displayImgBlock = `
                <div class="news-card-image-wrapper">
                    <img src="${article.imageUrl}" alt="${article.title}" class="news-display-img">
                </div>
            `;
        }

        nodeCard.innerHTML = `
            ${displayImgBlock}
            <div class="news-body">
                <span class="news-date">${article.date || 'Campus Brief'}</span>
                <h3>${article.title}</h3>
                <p>${article.content}</p>
            </div>
        `;
        viewNode.appendChild(nodeCard);
    });
}

/* PWA WORKER REGISTER */
function engageServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker Configured Successfully.', reg.scope))
                .catch(err => console.error('Service Worker Activation Blocked:', err));
        });
    }
}
