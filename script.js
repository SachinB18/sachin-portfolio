// ===== PORTFOLIO WEBSITE - OPTIMIZED JAVASCRIPT =====
// Performance optimizations:
// - Cached DOM queries outside scroll listeners
// - Throttled scroll events (50ms)
// - Passive event listeners for better scroll performance
// - Section reveal animations trigger only once
// - Debounced resize handler (250ms)
// - Event listener cleanup when animations complete

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
}

// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
}

// ===== Hamburger Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking nav links (except resume button)
    const navLinks = navMenu.querySelectorAll('a:not(.nav-resume-btn):not(.dropdown-item)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // Keyboard accessibility - ESC key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== Resume Dropdown Toggle =====
const resumeBtn = document.getElementById('resumeBtn');
const resumeDropdown = document.getElementById('resumeDropdown');

if (resumeBtn && resumeDropdown) {
    resumeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        resumeBtn.classList.toggle('active');
        resumeDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!resumeBtn.contains(e.target) && !resumeDropdown.contains(e.target)) {
            resumeBtn.classList.remove('active');
            resumeDropdown.classList.remove('show');
        }
    });

    // Close dropdown when clicking on dropdown items
    const dropdownItems = resumeDropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            resumeBtn.classList.remove('active');
            resumeDropdown.classList.remove('show');
            
            // Also close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) {
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}

// ===== Smooth Scrolling for Navbar Links =====
document.querySelectorAll('.nav-menu a:not(.dropdown-item)').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Only handle internal links (starting with #)
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});


// ===== Active Navbar Link Highlight on Scroll =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

// Cache section data to avoid repeated DOM queries
const sectionData = Array.from(sections).map(section => ({
    element: section,
    id: section.getAttribute('id'),
    offsetTop: section.offsetTop,
    height: section.offsetHeight
}));

// Throttle scroll events for better performance
let scrollTimeout;
function setActiveNavLink() {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
        const scrollPos = window.scrollY + 120;
        let currentSection = '';

        // Find active section
        for (let i = sectionData.length - 1; i >= 0; i--) {
            if (scrollPos >= sectionData[i].offsetTop) {
                currentSection = sectionData[i].id;
                break;
            }
        }

        // Update active link
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        scrollTimeout = null;
    }, 50);
}

// Use passive listener for better scroll performance
window.addEventListener('scroll', setActiveNavLink, { passive: true });

// ===== Section Reveal on Scroll (Trigger Once) =====
const revealSections = document.querySelectorAll('section');
const revealedSections = new Set();

function revealOnScroll() {
    if (revealedSections.size === revealSections.length) {
        // All sections revealed, remove listener
        window.removeEventListener('scroll', revealOnScroll);
        return;
    }

    const windowHeight = window.innerHeight;

    revealSections.forEach(section => {
        if (revealedSections.has(section)) return; // Skip already revealed

        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < windowHeight - 100) {
            section.classList.add('active');
            revealedSections.add(section);
        }
    });
}

// Add reveal class initially (prevents layout shift)
revealSections.forEach(section => {
    section.classList.add('reveal');
});

// Use passive listener and check on load
window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);

// ===== Update Section Cache on Resize =====
let resizeTimeout;
window.addEventListener('resize', function() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(() => {
        // Recalculate section positions after resize
        sectionData.forEach((data, index) => {
            const section = sections[index];
            data.offsetTop = section.offsetTop;
            data.height = section.offsetHeight;
        });
    }, 250);
}, { passive: true });

// ===== Project Card Focus Toggle =====
const projectCards = document.querySelectorAll('.project-card');
let currentFocusedCard = null;

projectCards.forEach(card => {
    // Handle click
    card.addEventListener('click', function(e) {
        // Prevent link clicks from triggering card toggle
        if (e.target.tagName === 'A') return;
        
        toggleCardFocus(card);
    });

    // Handle keyboard (Enter/Space)
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCardFocus(card);
        }
    });
});

function toggleCardFocus(card) {
    const isFocused = card.classList.contains('focused');
    
    // Remove focus from all cards
    projectCards.forEach(c => {
        c.classList.remove('focused', 'dimmed');
    });
    
    // If card wasn't focused, focus it and dim others
    if (!isFocused) {
        card.classList.add('focused');
        projectCards.forEach(c => {
            if (c !== card) {
                c.classList.add('dimmed');
            }
        });
        currentFocusedCard = card;
    } else {
        currentFocusedCard = null;
    }
}

// Click outside to unfocus
document.addEventListener('click', function(e) {
    if (currentFocusedCard && !e.target.closest('.project-card')) {
        projectCards.forEach(c => {
            c.classList.remove('focused', 'dimmed');
        });
        currentFocusedCard = null;
    }
});
