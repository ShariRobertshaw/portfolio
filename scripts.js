// Particle system for button hover effect
class ParticleSystem {
    constructor(canvas, color) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.color = color;
        this.particles = [];
        this.animationFrame = null;
        this.isActive = false;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticle(x, y) {
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1.0,
            decay: Math.random() * 0.02 + 0.015,
            size: Math.random() * 3 + 2
        };
    }
    
    addParticles(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(x, y));
        }
        if (!this.isActive) {
            this.animate();
        }
    }
    
    animate() {
        this.isActive = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = this.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                return true;
            }
            return false;
        });
        
        if (this.particles.length > 0) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        } else {
            this.isActive = false;
        }
    }
}

// Initialize particle buttons
function initParticleButtons() {
    const particleButtons = document.querySelectorAll('.particle-btn');
    
    particleButtons.forEach(button => {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        button.appendChild(canvas);
        
        const particleSystem = new ParticleSystem(canvas, '#114D00');
        
        button.addEventListener('mouseenter', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            particleSystem.addParticles(x, y, 20);
        });
        
        button.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.7) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                particleSystem.addParticles(x, y, 5);
            }
        });
    });
}

// Copy email to clipboard
function initEmailCopy() {
    const emailLink = document.getElementById('email-link');
    const copyMessage = document.getElementById('copy-message');
    const email = 'hello@sharirobertshaw.com';
    
    if (emailLink) {
        emailLink.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                await navigator.clipboard.writeText(email);
                
                // Show success message
                copyMessage.classList.add('show');
                setTimeout(() => {
                    copyMessage.classList.remove('show');
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    copyMessage.classList.add('show');
                    setTimeout(() => {
                        copyMessage.classList.remove('show');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy email:', err);
                }
                
                document.body.removeChild(textArea);
            }
        });
    }
}

// Initialize horizontal scroll for work section
function initWorkScroll() {
    const workGallery = document.querySelector('.work-gallery');
    const scrollArrow = document.querySelector('.scroll-arrow');
    
    if (scrollArrow && workGallery) {
        scrollArrow.addEventListener('click', () => {
            workGallery.scrollBy({
                left: 800,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize fade-in animations on load
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    
    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.2}s`;
        observer.observe(el);
    });
}

// Initialize new scroll animations (stagger load, text reveal)
function initScrollAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-load');
    const textReveals = document.querySelectorAll('.text-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    staggerContainers.forEach(container => observer.observe(container));
    textReveals.forEach(el => observer.observe(el));
}

// Initialize scroll fade for "What I do" sections
function initScrollFade() {
    const scrollFadeSections = document.querySelectorAll('.scroll-fade, .service-block');
    
    if (scrollFadeSections.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.classList.remove('fade-out');
            } else {
                // Fade out when leaving viewport
                entry.target.classList.remove('fade-in');
                entry.target.classList.add('fade-out');
            }
        });
    }, {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: '0px 0px -100px 0px'
    });
    
    scrollFadeSections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize accordion functionality
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        const icon = header.querySelector('.accordion-icon');
        const plusIcon = icon.querySelector('.plus-icon');
        const minusIcon = icon.querySelector('.minus-icon');
        
        // Set initial icon state
        const isInitiallyExpanded = header.getAttribute('aria-expanded') === 'true';
        if (isInitiallyExpanded) {
            if (minusIcon) minusIcon.style.display = 'block';
            if (plusIcon) plusIcon.style.display = 'none';
        } else {
            if (minusIcon) minusIcon.style.display = 'none';
            if (plusIcon) plusIcon.style.display = 'block';
        }
        
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const accordionContent = header.nextElementSibling;
            
            // Close all other accordions (optional - remove if you want multiple open)
            if (!isExpanded) {
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== header) {
                        const wasExpanded = otherHeader.getAttribute('aria-expanded') === 'true';
                        if (wasExpanded) {
                            otherHeader.setAttribute('aria-expanded', 'false');
                            const otherIcon = otherHeader.querySelector('.accordion-icon');
                            const otherPlusIcon = otherIcon.querySelector('.plus-icon');
                            const otherMinusIcon = otherIcon.querySelector('.minus-icon');
                            if (otherMinusIcon) otherMinusIcon.style.display = 'none';
                            if (otherPlusIcon) otherPlusIcon.style.display = 'block';
                        }
                    }
                });
            }
            
            // Toggle current accordion
            header.setAttribute('aria-expanded', !isExpanded);
            
            // Update icon
            if (!isExpanded) {
                // Opening - show minus
                if (minusIcon) minusIcon.style.display = 'block';
                if (plusIcon) plusIcon.style.display = 'none';
            } else {
                // Closing - show plus
                if (minusIcon) minusIcon.style.display = 'none';
                if (plusIcon) plusIcon.style.display = 'block';
            }
        });
    });
}

// Initialize Custom Cursor
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    // Move cursor with mouse
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Handle hover states
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            if (card.classList.contains('service-card-gener8')) {
                cursor.classList.add('cursor-gener8');
            } else if (card.classList.contains('service-card-hypa')) {
                cursor.classList.add('cursor-hypa');
            } else if (card.classList.contains('service-card-gener8labs')) {
                cursor.classList.add('cursor-gener8labs');
            }
        });

        card.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursor.classList.remove('cursor-gener8');
            cursor.classList.remove('cursor-hypa');
            cursor.classList.remove('cursor-gener8labs');
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initEmailCopy();
    initWorkScroll();
    initFadeInAnimations();
    initScrollAnimations();
    initScrollFade();
    initAccordions();
    initCustomCursor();
});
