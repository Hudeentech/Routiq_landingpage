// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Utility to split text into characters for bouncy, interactive animations
function splitTextIntoChars(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        const text = element.innerText;
        element.innerHTML = '';
        const isGradient = element.classList.contains('gradient-text');
        
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            // preserve spaces by adding margin, instead of innerHTML '&nbsp;' which breaks some fonts spacing
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
                span.style.width = '0.5em';
            } else {
                span.innerText = char;
            }
            span.classList.add('char-anim');
            
            // To ensure it reacts on hover
            span.addEventListener('mouseenter', () => {
                const isDark = document.documentElement.classList.contains('dark');
                const hoverColor = isDark 
                    ? (isGradient ? '#a78bfa' : '#8b5cf6') // Purple shades for dark mode
                    : (isGradient ? '#7c3aed' : '#8b5cf6'); // Purple shades for light mode

                gsap.to(span, {
                    y: -25,
                    scale: 1.3,
                    rotationZ: gsap.utils.random(-20, 20),
                    color: hoverColor,
                    duration: 0.3,
                    ease: "back.out(3)"
                });
            });
            span.addEventListener('mouseleave', () => {
                gsap.to(span, {
                    y: 0,
                    scale: 1,
                    rotationZ: 0,
                    color: '',
                    duration: 0.8,
                    ease: "elastic.out(1.2, 0.4)"
                });
            });
            element.appendChild(span);
        });
    });
}

document.addEventListener("DOMContentLoaded", (event) => {
    // Prepare bouncy text
    splitTextIntoChars('.hero-title-line');
    
    // Initial Load Animation Timeline
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Navbar animation
    tl.fromTo(".logo-anim", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        0.2
    );
    
    tl.fromTo(".nav-links a", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 
        0.3
    );
    
    tl.fromTo(".nav-btns a", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 
        0.4
    );

    // Hero Section Animation
    tl.fromTo(".badge-anim", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        0.5
    );

    // Bouncy entry animation for characters
    tl.fromTo(".char-anim", 
        { y: 150, opacity: 0, scale: 0.3, rotationZ: () => gsap.utils.random(-30, 30) }, 
        { 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            rotationZ: 0, 
            duration: 1.6, 
            stagger: 0.05, 
            ease: "elastic.out(1, 0.4)" 
        }, 
        0.5
    );
    
    tl.fromTo(".hero-subtitle", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        0.9
    );
    
    tl.fromTo(".hero-cta a", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, 
        1.0
    );
    
    tl.fromTo(".hero-stats div", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, 
        1.1
    );

    // Floating Mockup Setup
    const mockup = document.querySelector('.app-mockup');
    
    tl.fromTo(mockup, 
        { x: 100, opacity: 0, rotationY: -25, rotationX: 15 },
        { x: 0, opacity: 1, rotationY: -15, rotationX: 5, duration: 1.5, ease: "power3.out" },
        0.8
    );
    
    // Add continuous floating animation via GSAP
    gsap.to(mockup, {
        y: -15,
        rotationY: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.3
    });

    tl.fromTo(".glass-panel", 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, 
        1.5
    );
    
    // SCROLL TRIGGER ANIMATIONS
    
    // Features Header
    gsap.fromTo(".section-header", 
        { y: 50, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            scrollTrigger: {
                trigger: ".section-header",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Feature Cards Stagger
    gsap.fromTo(".feature-card", 
        { y: 50, opacity: 0, scale: 0.95 },
        { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8, 
            stagger: 0.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
                trigger: "#features",
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Showcase Section
    gsap.fromTo(".feature-showcase", 
        { y: 100, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".feature-showcase",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // CTA Section 
    const ctaTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".cta-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    ctaTl.fromTo(".cta-section h2", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
         .fromTo(".cta-section p", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
         .fromTo(".cta-section a", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.4");
         
    // Navbar styling on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/90', 'dark:bg-dark/80', 'backdrop-blur-md', 'shadow-sm', 'dark:shadow-2xl', 'border-b', 'border-slate-200', 'dark:border-slate-800/50');
            navbar.classList.remove('py-4');
            navbar.classList.add('py-2');
        } else {
            navbar.classList.remove('bg-white/90', 'dark:bg-dark/80', 'backdrop-blur-md', 'shadow-sm', 'dark:shadow-2xl', 'border-b', 'border-slate-200', 'dark:border-slate-800/50');
            navbar.classList.remove('py-2');
            navbar.classList.add('py-4');
        }
    });

    // Theme Switcher Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    
    // Mobile theme toggle buttons
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
    const mobileDarkIcon = document.getElementById('mobile-theme-dark-icon');
    const mobileLightIcon = document.getElementById('mobile-theme-light-icon');

    // Theme Detection and Initialization
    const updateThemeUI = (isDark) => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
            if (mobileLightIcon) mobileLightIcon.classList.remove('hidden');
            if (mobileDarkIcon) mobileDarkIcon.classList.add('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
            if (mobileDarkIcon) mobileDarkIcon.classList.remove('hidden');
            if (mobileLightIcon) mobileLightIcon.classList.add('hidden');
        }
    };

    // Determine initial theme on load
    const savedTheme = localStorage.getItem('color-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        updateThemeUI(true);
    } else {
        updateThemeUI(false);
    }

    function toggleTheme() {
        const isDarkNow = document.documentElement.classList.contains('dark');
        if (isDarkNow) {
            updateThemeUI(false);
            localStorage.setItem('color-theme', 'light');
        } else {
            updateThemeUI(true);
            localStorage.setItem('color-theme', 'dark');
        }
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);
    
    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            if (mobileMenu.classList.contains('hidden')) {
                // Open menu
                mobileMenu.classList.remove('hidden');
                // Small delay to allow display block to apply before transition
                requestAnimationFrame(() => {
                    mobileMenu.classList.remove('opacity-0');
                    mobileMenu.classList.add('opacity-100');
                });
            } else {
                // Close menu
                mobileMenu.classList.remove('opacity-100');
                mobileMenu.classList.add('opacity-0');
                // Wait for transition to finish before hiding
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            }
        });

        // Close mobile menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('opacity-100');
                mobileMenu.classList.add('opacity-0');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            });
        });
    }
});
