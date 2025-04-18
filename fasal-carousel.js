document.addEventListener('DOMContentLoaded', function() {
    // Function to set up all carousels in the Fasal project
    function setupFasalCarousels() {
        const carouselContainers = document.querySelectorAll('.carousel-content-section .single-image-container');
        
        carouselContainers.forEach(container => {
            // Skip setup if we're not on mobile
            if (window.innerWidth > 768) return;
            
            // Create a wrapper around the container if it doesn't exist
            let wrapper = container.parentElement.querySelector('.carousel-wrapper');
            if (!wrapper) {
                wrapper = document.createElement('div');
                wrapper.className = 'carousel-wrapper';
                
                // Insert wrapper before the container
                container.parentNode.insertBefore(wrapper, container);
                
                // Move container into wrapper
                wrapper.appendChild(container);
            }
            
            // Add navigation buttons to the wrapper (not the scrollable container)
            const prevButton = document.createElement('div');
            prevButton.className = 'carousel-nav carousel-nav-prev';
            
            const nextButton = document.createElement('div');
            nextButton.className = 'carousel-nav carousel-nav-next';
            
            // Add buttons to wrapper (not the scrollable container)
            wrapper.appendChild(prevButton);
            wrapper.appendChild(nextButton);
            
            // Get container width for 50% scroll calculation
            const containerWidth = container.clientWidth;
            
            // Initial scroll position
            let currentPosition = 0;
            const maxScroll = containerWidth; // This would be the full container width for a 200% wide image
            
            // Add scroll snap points by setting the scroll positions
            container.scrollLeft = 0; // Start at the beginning
            
            // Function to handle navigation clicks
            function handleNavigation(direction) {
                if (direction === 'prev' && currentPosition > 0) {
                    // Scroll left by 50% of container width
                    currentPosition = 0;
                } else if (direction === 'next' && currentPosition < maxScroll) {
                    // Scroll right by 50% of container width
                    currentPosition = containerWidth;
                }
                
                // Smooth scroll to new position
                container.scrollTo({
                    left: currentPosition,
                    behavior: 'smooth'
                });
            }
            
            // Event listeners for navigation buttons
            prevButton.addEventListener('click', () => handleNavigation('prev'));
            nextButton.addEventListener('click', () => handleNavigation('next'));
            
            // Touch swipe functionality
            let startX, moveX;
            let isScrolling = false;
            
            // Touch events
            container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isScrolling = true;
            }, { passive: true });
            
            container.addEventListener('touchmove', (e) => {
                if (!isScrolling) return;
                
                moveX = e.touches[0].clientX;
                
                // Calculate the difference
                const diff = startX - moveX;
                
                // Optional: prevent default to avoid page scrolling while swiping
                // This is commented out to keep it passive for better performance
                // if (Math.abs(diff) > 5) e.preventDefault();
            }, { passive: true });
            
            container.addEventListener('touchend', (e) => {
                isScrolling = false;
                
                if (!moveX) return;
                
                const diff = startX - moveX;
                
                // Detect direction and threshold for swipe (15% of container width)
                const threshold = containerWidth * 0.15;
                
                if (diff > threshold) {
                    // Swipe left to right - show next part
                    handleNavigation('next');
                } else if (diff < -threshold) {
                    // Swipe right to left - show previous part
                    handleNavigation('prev');
                } else {
                    // Snap back to current position if swipe wasn't enough
                    container.scrollTo({
                        left: currentPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Reset touch tracking
                startX = null;
                moveX = null;
            }, { passive: true });
            
            // Update current position on scroll
            container.addEventListener('scroll', () => {
                // This helps keep track of where we are after manual scrolling
                if (container.scrollLeft > containerWidth / 2) {
                    currentPosition = containerWidth;
                } else {
                    currentPosition = 0;
                }
            }, { passive: true });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 768) {
                    // Update measurements on resize
                    const newContainerWidth = container.clientWidth;
                    
                    // Adjust maxScroll and currentPosition proportionally
                    const scrollRatio = currentPosition / containerWidth;
                    containerWidth = newContainerWidth;
                    maxScroll = containerWidth;
                    currentPosition = Math.round(scrollRatio * containerWidth);
                    
                    // Update scroll position
                    container.scrollLeft = currentPosition;
                }
            });
        });
    }
    
    // Initialize carousels
    setupFasalCarousels();
    
    // Re-setup on resize (in case we cross the mobile breakpoint)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Remove existing navigation buttons and unwrap containers if needed
            document.querySelectorAll('.carousel-nav').forEach(nav => nav.remove());
            
            // Check for wrappers that need to be removed
            if (window.innerWidth > 768) {
                document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
                    const container = wrapper.querySelector('.single-image-container');
                    if (container) {
                        // Move container out of wrapper back to original parent
                        wrapper.parentNode.insertBefore(container, wrapper);
                        // Remove the wrapper
                        wrapper.parentNode.removeChild(wrapper);
                    }
                });
            }
            
            setupFasalCarousels();
        }, 250);
    });
}); 