// Main JavaScript file for BusTrak Bus Management System

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current date for any date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    if (dateInputs.length > 0) {
        const today = new Date();
        const formattedDate = today.toISOString().substr(0, 10);
        
        dateInputs.forEach(input => {
            input.value = formattedDate;
            input.min = formattedDate;
        });
    }
    
    // Add event listener for mobile menu toggle if it exists
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const nav = document.querySelector('nav ul');
            nav.classList.toggle('show');
        });
    }
    
    // Initialize any sliders or carousels
    initializeCarousel();
});

// Simple carousel functionality for testimonials or featured buses
function initializeCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.carousel-item');
    const nextBtn = carousel.querySelector('.carousel-next');
    const prevBtn = carousel.querySelector('.carousel-prev');
    
    let currentIndex = 0;
    
    // Show only the current item
    function updateCarousel() {
        items.forEach((item, index) => {
            if (index === currentIndex) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Initialize
    updateCarousel();
    
    // Next button event
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        });
    }
    
    // Previous button event
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
        });
    }
    
    // Auto slide every 5 seconds
    setInterval(function() {
        if (nextBtn) {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        }
    }, 5000);
} 