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
                <ul class="nav-links">
                    <li><a href="index.html" class="nav-link"><span class="nav-link-text">Work</span></a></li>
                    <li><a href="about.html" class="nav-link"><span class="nav-link-text">About</span></a></li>
                    <li><a href="about.html" class="nav-link"><span class="nav-link-text">Services</span></a></li>
                    <li><a href="index.html#contact" class="nav-link"><span class="nav-link-text">Contact</span></a></li>
                </ul>
            </nav>
        `;
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

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadNav();
    loadFooter();
});

