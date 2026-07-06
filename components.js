// Load navigation component
function loadNav() {
    const navContainer = document.getElementById('nav-container');
    if (navContainer) {
        navContainer.innerHTML = `
            <nav class="nav">
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
                    <li><a href="works.html" class="nav-link"><span class="nav-link-text">Work</span></a></li>
                    <li><a href="about.html" class="nav-link"><span class="nav-link-text">About</span></a></li>
                    <li><a href="services.html" class="nav-link"><span class="nav-link-text">Services</span></a></li>
                    <li><a href="index.html#contact" class="nav-link"><span class="nav-link-text">Contact</span></a></li>
                </ul>
                <div class="mobile-menu-overlay">
                    <ul class="mobile-menu-links">
                        <li><a href="works.html" class="mobile-menu-link">Work</a></li>
                        <li><a href="about.html" class="mobile-menu-link">About</a></li>
                        <li><a href="services.html" class="mobile-menu-link">Services</a></li>
                        <li><a href="index.html#contact" class="mobile-menu-link">Contact</a></li>
                    </ul>
                </div>
            </nav>
        `;
        
        // Initialize mobile menu functionality
        initMobileMenu();
    }
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
        
        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });
        
        // Close menu when clicking overlay
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
            <section class="contact-section" id="contact">
                <div class="section-header">
                    <h2 class="section-label">Get in touch</h2>
                </div>
                <div class="contact-content">
                    <p class="contact-text">
                        Email me at <a href="#" class="email-link" id="email-link">hello@sharirobertshaw.com</a>
                    </p>
                    <p class="contact-text">
                        <a href="https://calendly.com/shari-robertshaw/30min" target="_blank" rel="noopener noreferrer" class="linkedin-link">Book a call</a>, or find me on <a href="https://www.linkedin.com/in/sharirobertshaw/" target="_blank" rel="noopener noreferrer" class="linkedin-link">LinkedIn</a>
                    </p>
                </div>
                <div class="copy-message" id="copy-message">Email copied to clipboard!</div>
            </section>
        `;
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadNav();
    loadFooter();
    loadContact();
});

