function navLink(href, label) {
    const chars = [...label].map((char, index) =>
        `<span class="nav-link-char" style="transition-delay:${index * 0.01}s">${char}</span>`
    ).join('');
    return `<li><a href="${href}" class="nav-link" aria-label="${label}"><span class="nav-link-text" aria-hidden="true">${chars}</span></a></li>`;
}

// Load navigation component
function loadNav() {
    const navContainer = document.getElementById('nav-container');
    if (navContainer) {
        navContainer.innerHTML = `
            <div class="nav-shell" id="nav-shell">
                <nav class="nav nav-pill">
                    <a href="index.html" class="logo-link">
                        <div class="logo">
                            Shari<span>Robertshaw</span>
                        </div>
                    </a>
                    <button class="hamburger-menu" aria-label="Toggle menu" aria-expanded="false">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                    <ul class="nav-links">
                        ${navLink('about.html', 'About')}
                        ${navLink('services.html', 'Services')}
                        ${navLink('index.html#work', 'Work')}
                        ${navLink('index.html#contact', 'Contact')}
                    </ul>
                </nav>
            </div>
            <div class="mobile-menu-overlay">
                <ul class="mobile-menu-links">
                    <li><a href="about.html" class="mobile-menu-link">About</a></li>
                    <li><a href="services.html" class="mobile-menu-link">Services</a></li>
                    <li><a href="index.html#work" class="mobile-menu-link">Work</a></li>
                    <li><a href="index.html#contact" class="mobile-menu-link">Contact</a></li>
                </ul>
            </div>
        `;
        
        initMobileMenu();
        initNavScrollHide();
    }
}

function initNavScrollHide() {
    const shell = document.getElementById('nav-shell');
    if (!shell) return;

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
        const y = window.scrollY;
        const goingDown = y > lastY;
        if (goingDown && y > 80) {
            shell.classList.add('nav-shell--hidden');
        } else {
            shell.classList.remove('nav-shell--hidden');
        }
        lastY = y;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isOpen);
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.style.overflow = !isOpen ? 'hidden' : '';
        });
        
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });
        
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
}

// Load footer component
function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer class="footer">
                <p>&copy; ${new Date().getFullYear()} Shari Robertshaw. All rights reserved.</p>
            </footer>
        `;
    }
}

// Load contact section component
function loadContact() {
    const contactContainer = document.getElementById('contact-container');
    if (contactContainer) {
        contactContainer.innerHTML = `
            <section class="contact-section contact-section--redesign" id="contact">
                <div class="contact-content contact-content--split">
                    <p class="contact-text">
                        Email me at <a href="#" class="email-link" id="email-link">hello@sharirobertshaw.com</a>
                    </p>
                    <p class="contact-text">
                        Find me on <a href="https://www.linkedin.com/in/sharirobertshaw/" target="_blank" rel="noopener noreferrer" class="linkedin-link">LinkedIn</a>
                    </p>
                </div>
                <div class="copy-message" id="copy-message">Email copied to clipboard!</div>
            </section>
        `;
    }
}

function loadCloudflareAnalytics() {
    if (document.querySelector('script[data-cf-beacon]')) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute(
        'data-cf-beacon',
        JSON.stringify({ token: 'e016bf0e857c4c19bba05ba50bdfbe5e' })
    );
    document.body.appendChild(script);
}

const buttonChevron = {
    prev: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3.5L5.5 8 10 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function buttonIcon(direction) {
    const icon = document.createElement('span');
    icon.className = 'btn-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = buttonChevron[direction];
    return icon;
}

// Turns any <a class="btn"> or <button class="btn"> into the shared button.
// Default is the forward style. Add btn--prev for a back chevron.
function enhanceButtons(root = document) {
    root.querySelectorAll('a.btn, button.btn').forEach((el) => {
        if (el.dataset.buttonReady === 'true') return;

        const isPrev = el.classList.contains('btn--prev');
        const existing = el.querySelector('.btn-text, .btn-label, .project-nav-label');
        const label = (existing ? existing.textContent : el.textContent).trim();

        el.replaceChildren();
        if (isPrev) el.append(buttonIcon('prev'));

        const labelEl = document.createElement('span');
        labelEl.className = 'btn-label';
        labelEl.textContent = label;
        el.append(labelEl);

        if (!isPrev) el.append(buttonIcon('next'));
        el.dataset.buttonReady = 'true';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadNav();
    loadFooter();
    loadContact();
    loadCloudflareAnalytics();
    enhanceButtons();
    loadCursorGlyphs();
});

function loadCursorGlyphs() {
    if (document.getElementById('cursor-glyphs-css')) return;

    const link = document.createElement('link');
    link.id = 'cursor-glyphs-css';
    link.rel = 'stylesheet';
    link.href = 'cursor-glyphs.css?v=3';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'cursor-glyphs.js?v=3';
    document.body.appendChild(script);
}
