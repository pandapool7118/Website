// Theme Initialization - Run immediately
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
            } else {
    document.documentElement.classList.remove('dark');
}

// Navigation Active State
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Setup
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggleBtn?.querySelector('svg path');

    function updateThemeIcon(isDark) {
        if (themeToggleIcon) {
            // Moon icon for dark mode, sun icon for light mode
            const darkIcon = 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z';
            const lightIcon = 'M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z';
            
            themeToggleIcon.setAttribute('d', isDark ? darkIcon : lightIcon);
        }
    }

    // Update icon based on current theme
    updateThemeIcon(document.documentElement.classList.contains('dark'));

    // Theme toggle click handler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle theme
            document.documentElement.classList.toggle('dark');
            
            const isDark = document.documentElement.classList.contains('dark');
            
            // Update localStorage
            localStorage.theme = isDark ? 'dark' : 'light';
            updateThemeIcon(isDark);
            
            // Update meta theme color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
                metaTheme.content = isDark ? '#1f2937' : '#ffffff';
            }
            
            // Framer Motion Animation - Morphing Effect
            if (window.motion) {
                const themeIcon = document.getElementById('theme-icon');
                if (themeIcon) {
                    // Morphing animation sequence
                    motion.animate(themeIcon, 
                        {
                            scale: [1, 0, 1],
                            rotate: [0, 180, 360],
                            opacity: [1, 0, 1]
                        },
                        {
                            duration: 0.7,
                            ease: "easeInOut",
                            times: [0, 0.5, 1]
                        }
                    );
                }
                }
            });
        }

    const navButtons = document.querySelectorAll('.nav-btn[data-section]');

function setActiveNavButton(sectionId) {
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-section') === sectionId) {
            btn.classList.add('active');
            } else {
                btn.classList.remove('active');
        }
    });
}

    // Set initial active state
    const currentPath = window.location.pathname;
    if (currentPath.includes('about.html')) {
        setActiveNavButton('about');
    } else if (currentPath.includes('work.html')) {
        setActiveNavButton('work');
    } else if (currentPath.includes('contact.html')) {
        setActiveNavButton('contact');
    } else {
        setActiveNavButton('home');
    }
    
    // Handle navigation button clicks
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            setActiveNavButton(sectionId);
        });
    });
});

// Typing Animation
document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.getElementById('typing-text');
    
    if (typingElement) {
        const texts = [
            'Product Designer',
            'Visual Designer', 
            'Brand Whisperer',
            'Motion & Video Designer',
            'Graphic Designer',
            'Design Systems Builder',
            'Creative Strategist',
            'Entrepreneurial Designer',
            'Lifelong Learner'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let deletingSpeed = 50;
        let pauseTime = 2000;
        
        function typeText() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                // Deleting characters
                typingElement.textContent = ' ' + currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = deletingSpeed;
            } else {
                // Typing characters
                typingElement.textContent = ' ' + currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                // Finished typing, pause then start deleting
                typingSpeed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting, move to next text
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before starting next text
            }
            
            setTimeout(typeText, typingSpeed);
        }
        
        // Start the typing animation
        typeText();
    }
});

// Ripple Effect
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event ? event.clientX - rect.left - size / 2 : rect.width / 2;
    const y = event ? event.clientY - rect.top - size / 2 : rect.height / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    });
});