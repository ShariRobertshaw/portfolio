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
                        <li><a href="about.html" class="nav-link"><span class="nav-link-text">About</span></a></li>
                        <li><a href="services.html" class="nav-link"><span class="nav-link-text">Services</span></a></li>
                        <li><a href="index.html#work" class="nav-link"><span class="nav-link-text">Work</span></a></li>
                        <li><a href="index.html#contact" class="nav-link"><span class="nav-link-text">Contact</span></a></li>
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

document.addEventListener('DOMContentLoaded', () => {
    loadNav();
    loadFooter();
    loadContact();
    loadCloudflareAnalytics();
});
