document.addEventListener('DOMContentLoaded', function() {
    // Initialize all carousels on the page
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(function(container) {
        const carousel = container.querySelector('.carousel');
        const slides = container.querySelectorAll('.carousel-slide');
        const dotsContainer = container.querySelector('.carousel-controls');
        const prevBtn = container.querySelector('.carousel-prev');
        const nextBtn = container.querySelector('.carousel-next');
        
        let currentIndex = 0;
        const slideCount = slides.length;
        
        // Create dots for each slide
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        // Get all dots after creation
        const dots = container.querySelectorAll('.carousel-dot');
        
        // Set initial position
        updateCarousel();
        
        // Event listeners for controls
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        // Set up automatic sliding if specified
        if (container.dataset.autoplay === 'true') {
            const interval = parseInt(container.dataset.interval) || 5000;
            setInterval(nextSlide, interval);
        }
        
        // Functions to control the carousel
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateCarousel();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }
        
        function updateCarousel() {
            // Update carousel position
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Handle touch events for mobile swiping
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        let isSwiping = false;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            // Optional animation during swipe for better user feedback
            const currentX = e.changedTouches[0].screenX;
            const diff = currentX - touchStartX;
            const offsetPercentage = (diff / carousel.offsetWidth) * 25; // Limit movement to 25% max
            
            if (Math.abs(offsetPercentage) < 25) {
                carousel.style.transform = `translateX(calc(-${currentIndex * 100}% + ${offsetPercentage}px))`;
            }
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            isSwiping = false;
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const horizontalDistance = touchEndX - touchStartX;
            const verticalDistance = touchEndY - touchStartY;
            
            // Ensure it's a horizontal swipe, not a vertical scroll
            if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
                if (horizontalDistance < -swipeThreshold) {
                    // Swiped left
                    nextSlide();
                } else if (horizontalDistance > swipeThreshold) {
                    // Swiped right
                    prevSlide();
                } else {
                    // Reset to current slide if swipe wasn't enough
                    updateCarousel();
                }
            } else {
                // It was more of a vertical movement, reset to current slide
                updateCarousel();
            }
        }
    });
    
    // Initialize random image galleries
    const randomGalleries = document.querySelectorAll('.random-gallery');
    
    randomGalleries.forEach(function(gallery) {
        const images = Array.from(gallery.querySelectorAll('img'));
        
        // Shuffle the images
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // Remove the image element from DOM
            const imageI = images[i];
            const imageJ = images[j];
            
            // Swap the src and alt attributes
            const tempSrc = imageI.src;
            const tempAlt = imageI.alt;
            
            imageI.src = imageJ.src;
            imageI.alt = imageJ.alt;
            
            imageJ.src = tempSrc;
            imageJ.alt = tempAlt;
        }
    });

    // Initialize all image sliders
    const sliders = document.querySelectorAll('.image-slider-container');
    
    sliders.forEach(sliderContainer => {
        const slider = sliderContainer.querySelector('.image-slider');
        const prevBtn = sliderContainer.querySelector('.slider-nav-prev');
        const nextBtn = sliderContainer.querySelector('.slider-nav-next');
        const items = slider.querySelectorAll('.slider-item');
        
        if (!items.length) return;
        
        // Adjust width based on number of items
        const itemCount = items.length;
        items.forEach(item => {
            item.style.flex = `0 0 ${100 / itemCount}%`;
            item.style.width = `${100 / itemCount}%`;
        });
        
        // After images load, set container height to tallest image
        let maxHeight = 0;
        let imagesLoaded = 0;
        
        // Function to set container height based on tallest item
        function setContainerHeight() {
            // Reset max height for recalculation
            maxHeight = 0;
            
            // Find the tallest image based on actual rendered size
            items.forEach(item => {
                const img = item.querySelector('img');
                if (img && img.complete) {
                    // Get the natural dimensions
                    const imgNaturalWidth = img.naturalWidth || img.width || 300;
                    const imgNaturalHeight = img.naturalHeight || img.height || 300;
                    
                    // Calculate displayed height based on aspect ratio and container width
                    const containerWidth = item.clientWidth;
                    const scaledHeight = (containerWidth / imgNaturalWidth) * imgNaturalHeight;
                    
                    if (scaledHeight > maxHeight) {
                        maxHeight = scaledHeight;
                    }
                }
            });
            
            // If no height was calculated (e.g., images not loaded yet), use reasonable defaults
            if (maxHeight === 0) {
                const containerWidth = items[0]?.clientWidth || 300;
                maxHeight = containerWidth * 0.75; // Assume 4:3 aspect ratio as fallback
            }
            
            // Set a reasonable max height (not too tall)
            maxHeight = Math.min(maxHeight, 500);
            
            // Set minimum height
            maxHeight = Math.max(maxHeight, 200);
            
            // Apply the height to all items and container
            items.forEach(item => {
                item.style.height = `${maxHeight}px`;
            });
            
            // Set container height
            sliderContainer.style.height = `${maxHeight}px`;
        }
        
        // Call on load
        setContainerHeight();
        
        // Also call when images are loaded
        items.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                if (img.complete) {
                    imagesLoaded++;
                    if (imagesLoaded === items.length) {
                        // All images are already loaded
                        setContainerHeight();
                    }
                } else {
                    img.onload = function() {
                        imagesLoaded++;
                        if (imagesLoaded === items.length) {
                            // All images have loaded
                            setContainerHeight();
                        }
                    };
                }
            }
        });
        
        // Call again after a short delay to ensure accurate calculations
        setTimeout(setContainerHeight, 500);
        
        // Calculate how many items to scroll
        const itemWidth = 100 / itemCount;
        const scrollAmount = itemWidth;
        
        // Current position tracker (in percentage)
        let position = 0;
        
        // Calculate maximum scroll position (in percentage)
        const maxScroll = 100 - 100;
        
        // Handle previous button click
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                position = Math.max(position - scrollAmount, 0);
                updateSliderPosition();
            });
        }
        
        // Handle next button click
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                position = Math.min(position + scrollAmount, maxScroll);
                updateSliderPosition();
            });
        }
        
        // Update slider position
        function updateSliderPosition() {
            slider.style.transform = `translateX(-${position}%)`;
            
            // Update button states if they exist
            if (prevBtn && nextBtn) {
                prevBtn.style.opacity = position <= 0 ? '0.5' : '1';
                nextBtn.style.opacity = position >= maxScroll ? '0.5' : '1';
            }
        }
        
        // Initialize button states
        updateSliderPosition();
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Recalculate heights
            setContainerHeight();
        });
    });
}); 