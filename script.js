document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.padding = '1rem 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.case-study, .timeline-item, .timeline-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.85) {
                element.style.opacity = '1';
                element.style.transform = element.classList.contains('timeline-card') 
                    ? 'translateY(0)' 
                    : 'translateY(0)';
            }
        });
    };

    // Timeline animation
    const animateTimeline = () => {
        const timelineVerticalLine = document.querySelector('.timeline-vertical-line');
        const timelinePointers = document.querySelectorAll('.timeline-pointer');
        const timeline = document.querySelector('.timeline');
        const lastTimelineItem = document.querySelector('.timeline-item:last-child');
        
        if (!timeline || !timelineVerticalLine) return;
        
        const timelineRect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 768;
        
        // Check if timeline is in view
        if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
            // Calculate how much of the timeline is visible
            const visibleHeight = Math.min(windowHeight, timelineRect.bottom) - Math.max(0, timelineRect.top);
            
            // Start animation when top of timeline enters viewport
            let heightPercentage = 0;
            
            if (timelineRect.top < windowHeight * 0.8) {
                // Calculate scroll progress based on how far timeline has entered viewport
                // Use different coefficients for mobile to account for reduced spacing
                const scrollFactor = isMobile ? 0.9 : 0.7;
                const scrollProgress = (windowHeight * 0.8 - timelineRect.top) / (windowHeight * 0.5 + timeline.offsetHeight * scrollFactor);
                
                // Limit maximum height to 95% to ensure it stops at the last box
                heightPercentage = Math.min(Math.max(scrollProgress * 100, 0), 95);
                
                // Check if we're viewing the last item
                if (lastTimelineItem) {
                    const lastItemRect = lastTimelineItem.getBoundingClientRect();
                    
                    // If last item is in view, fix the line height to 95%
                    if (lastItemRect.top < windowHeight * 0.9) {
                        heightPercentage = 95;
                    }
                }
            }
            
            // Apply the calculated height
            timelineVerticalLine.style.height = `${heightPercentage}%`;
            
            // Animate pointers
            timelinePointers.forEach((pointer, index) => {
                const pointerRect = pointer.getBoundingClientRect();
                
                if (pointerRect.top < windowHeight * 0.85) {
                    pointer.classList.add('animated');
                } else {
                    pointer.classList.remove('animated');
                }
            });
        } else {
            // Timeline not in view, reset line height
            timelineVerticalLine.style.height = '0%';
        }
    };

    // Setup Stories navigation
    const setupStoriesNav = () => {
        // Skip setup on mobile devices
        if (window.innerWidth <= 768) return;
        
        const marquees = document.querySelectorAll('#marquee');
        let marqueeCounter = 0;
        
        // Clean up any existing navigation buttons before setup
        document.querySelectorAll('.marquee-nav').forEach(btn => btn.remove());
        
        marquees.forEach(marquee => {
            // Give each marquee a unique ID to avoid conflicts
            if (marquee.id === 'marquee') {
                // If it's the default ID, append a number to make it unique
                marqueeCounter++;
                if (marqueeCounter > 1) {
                    marquee.id = `marquee-${marqueeCounter - 1}`;
                }
            }
            
            if (!marquee) return;
            
            // Get sections instead of individual items
            const sections = marquee.querySelectorAll('.stories-section');
            if (sections.length === 0) return;
            
            // Create and add navigation buttons
            const marqueeWrapper = marquee.parentElement;
            
            // Create navigation buttons
            const prevButton = document.createElement('div');
            prevButton.className = 'marquee-nav carousel-nav carousel-nav-prev';
            
            const nextButton = document.createElement('div');
            nextButton.className = 'marquee-nav carousel-nav carousel-nav-next';
            
            // Add to wrapper
            marqueeWrapper.appendChild(prevButton);
            marqueeWrapper.appendChild(nextButton);
            
            // Track current section
            let currentSection = 0;
            
            // Function to scroll to a specific section
            const scrollToSection = (index) => {
                if (index < 0) index = 0;
                if (index >= sections.length) index = sections.length - 1;
                
                currentSection = index;
                
                // For centered content, use scrollIntoView with center option
                // instead of calculating exact offsets
                sections[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
                
                // Update button states
                prevButton.style.opacity = currentSection <= 0 ? '0.5' : '1';
                nextButton.style.opacity = currentSection >= sections.length - 1 ? '0.5' : '1';
            };
            
            // Handle navigation clicks
            prevButton.addEventListener('click', () => {
                scrollToSection(currentSection - 1);
            });
            
            nextButton.addEventListener('click', () => {
                scrollToSection(currentSection + 1);
            });
            
            // Set initial button states
            prevButton.style.opacity = '0.5'; // Start with prev disabled
            nextButton.style.opacity = sections.length <= 1 ? '0.5' : '1';
            
            // Handle scroll events to update current section
            marquee.addEventListener('scroll', () => {
                // Find which section is most visible
                const containerLeft = marquee.scrollLeft;
                const containerWidth = marquee.clientWidth;
                const containerCenter = containerLeft + containerWidth / 2;
                
                let closestSection = 0;
                let closestDistance = Infinity;
                
                sections.forEach((section, index) => {
                    const sectionLeft = section.offsetLeft;
                    const sectionWidth = section.offsetWidth;
                    const sectionCenter = sectionLeft + sectionWidth / 2;
                    
                    const distance = Math.abs(containerCenter - sectionCenter);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestSection = index;
                    }
                });
                
                // Update current section without scrolling
                if (currentSection !== closestSection) {
                    currentSection = closestSection;
                    
                    // Update button states
                    prevButton.style.opacity = currentSection <= 0 ? '0.5' : '1';
                    nextButton.style.opacity = currentSection >= sections.length - 1 ? '0.5' : '1';
                }
            }, { passive: true });
            
            // Remove any touch event listeners that might interfere
            marquee.addEventListener('touchstart', (e) => {
                // On mobile, prevent all default touch behaviors for marquee
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                }
                e.stopPropagation();
            }, { passive: window.innerWidth > 768 });
            
            marquee.addEventListener('touchmove', (e) => {
                // On mobile, completely prevent touch move
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                }
                e.stopPropagation();
            }, { passive: false });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                // Remove existing buttons on large screens
                if (window.innerWidth > 768) {
                    document.querySelectorAll('.marquee-nav').forEach(btn => btn.remove());
                }
            });
        });
    };

    // Set initial states for animation
    document.querySelectorAll('.case-study, .timeline-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    document.querySelectorAll('.timeline-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease';
    });

    // Initialize timeline elements
    const timelineVerticalLine = document.querySelector('.timeline-vertical-line');
    if (timelineVerticalLine) {
        timelineVerticalLine.style.height = '0%';
        timelineVerticalLine.style.transition = 'height 0.5s ease-out';
    }
    
    document.querySelectorAll('.timeline-pointer').forEach((pointer, index) => {
        pointer.style.opacity = '0';
        pointer.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    });

    // Run animations on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            animateOnScroll();
            animateTimeline();
        });
    });
    
    // Run once on load
    setTimeout(() => {
        animateOnScroll();
        animateTimeline();
        setupStoriesNav();
    }, 100);

    // Find all case-info h3 elements
    const caseTitles = document.querySelectorAll('.case-info h3, .mini-case-study h3');
    
    // Process each title
    caseTitles.forEach(title => {
        const text = title.textContent;
        if (text.includes('–')) {
            const parts = text.split('–');
            // Replace the title content with formatted version - without the hyphen
            title.innerHTML = parts[0].trim() + '<span class="subtitle">' + parts[1].trim() + '</span>';
        }
    });
}); 