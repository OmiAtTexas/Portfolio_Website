// DOM Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const mobileToggle = document.getElementById('mobileToggle');
const navLinksContainer = document.querySelector('.nav-links');
const backToTop = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeTypewriter();
    initializeCounters();
    initializeParticles();
    initializeTheme();
    initializeSmoothScroll();
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate stats when about section is visible
            if (entry.target.id === 'about') {
                animateCounters();
            }

            // Add staggered animation to cards
            const cards = entry.target.querySelectorAll('.card, .project-card, .cert-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Typewriter Effect
function initializeTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    const texts = [
        "CS Student",
        "Aspiring AI Engineer",
        "Web Developer",
        "UI/UX Designer",
        "Problem Solver",
        "Tech Enthusiast"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        counter.style.opacity = '0';
        counter.style.transform = 'translateY(20px)';
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        counter.style.opacity = '1';
        counter.style.transform = 'translateY(0)';

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// Theme Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Menu Toggle
mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Smooth Scrolling
function initializeSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Active Navigation Link
window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop &&
            window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Particle System
function initializeParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';

    document.body.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 50;
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize Animations
function initializeAnimations() {
    // Add initial styles for cards
    const cards = document.querySelectorAll('.card, .project-card, .cert-card, .skill-category, .timeline-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
}

// Mouse Parallax Effect
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;

        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// Form Validation (if contact form exists)
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);

        // Track Core Web Vitals
        if ('web-vital' in window) {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        }
    });
}

// Service Worker Registration
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// Analytics (placeholder)
function trackEvent(eventName, properties = {}) {
    // This would integrate with your analytics service
    console.log('Event tracked:', eventName, properties);
}

// Track navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('navigation_click', {
            section: link.getAttribute('href')
        });
    });
});

// Track project clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('.project-link')) {
        const projectCard = e.target.closest('.project-card');
        const projectTitle = projectCard.querySelector('h3').textContent;

        trackEvent('project_click', {
            project: projectTitle,
            link_type: e.target.closest('.project-link').getAttribute('aria-label')
        });
    }
});

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initializeContactForm();
    initializeLazyLoading();
    initializePerformanceMonitoring();
    initializeServiceWorker();
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    // Update progress bar
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';

    // Update back to top button
    if (scrollTop > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Update navbar background
    const navbar = document.querySelector('.navbar');
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(10, 25, 47, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 25, 47, 0.95)';
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        '/images/profile.jpg',
        '/fonts/poppins.woff2'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.jpg') ? 'image' : 'font';
        if (link.as === 'font') {
            link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// Easter Egg - Konami Code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);

    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add rainbow animation to the page
    document.body.style.animation = 'rainbow 2s infinite';

    // Add CSS for rainbow effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');

    // Remove effect after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
        document.head.removeChild(style);
    }, 5000);
}

// Console message for developers
console.log(`
%c
 ██████╗ ███╗   ███╗    ███╗   ███╗ ██████╗ ██████╗ ███████╗
██╔═══██╗████╗ ████║    ████╗ ████║██╔═══██╗██╔══██╗██╔════╝
██║   ██║██╔████╔██║    ██╔████╔██║██║   ██║██████╔╝█████╗  
██║   ██║██║╚██╔╝██║    ██║╚██╔╝██║██║   ██║██╔══██╗██╔══╝  
╚██████╔╝██║ ╚═╝ ██║    ██║ ╚═╝ ██║╚██████╔╝██║  ██║███████╗
 ╚═════╝ ╚═╝     ╚═╝    ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝

Hey there, fellow developer! 👋
Thanks for checking out my portfolio.
Feel free to reach out if you want to collaborate!

Email: opm281706@gmail.com
LinkedIn: https://www.linkedin.com/in/moreom/
GitHub: https://github.com/OmiAtTexas
`, 'color: #64ffda; font-family: monospace;');


