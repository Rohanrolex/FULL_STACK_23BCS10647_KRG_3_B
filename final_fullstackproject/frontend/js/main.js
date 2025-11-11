// Check login status and update UI
const checkLoginStatus = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.querySelector('a[href="login.html"]');
    
    if (user && user.isLoggedIn) {
        // User is logged in
        if (loginBtn) {
            // Change login button to user menu
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.firstName || user.email.split('@')[0]}`;
            loginBtn.href = '#';
            loginBtn.classList.add('user-menu-trigger');
            
            // Create user menu
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <div class="user-menu-header">
                    <i class="fas fa-user-circle"></i>
                    <span>${user.firstName ? user.firstName + ' ' + user.lastName : user.email}</span>
                </div>
                <div class="user-menu-items">
                    <a href="#"><i class="fas fa-ticket-alt"></i> My Bookings</a>
                    <a href="#"><i class="fas fa-cog"></i> Account Settings</a>
                    <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            `;
            
            // Append to login button's parent
            loginBtn.parentNode.appendChild(userMenu);
            
            // Toggle user menu on click
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                userMenu.classList.toggle('active');
            });
            
            // Handle logout
            document.getElementById('logout-btn').addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!loginBtn.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.remove('active');
                }
            });
        }
    }
};

// Logout function
const logout = () => {
    // Clear user data
    localStorage.removeItem('user');
    
    // Show logout message
    const messageElement = document.createElement('div');
    messageElement.className = 'message info global-message';
    messageElement.innerHTML = `<p>You have been logged out successfully.</p>`;
    document.body.appendChild(messageElement);
    
    // Auto remove message
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            messageElement.remove();
            // Redirect to home
            window.location.href = 'index.html';
        }, 500);
    }, 2000);
};

// Main JavaScript file for the Bus System website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = menuToggle.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu when clicking outside
    overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking on a menu item
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Dynamic Particles
    const particles = document.querySelector('.particles');
    if (particles) {
        // Create additional particles dynamically
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + 70 + '%';
            particle.style.width = Math.random() * 6 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particle.style.animationDelay = Math.random() * 12 + 's';
            particle.style.animationDuration = Math.random() * 12 + 8 + 's';
            particles.appendChild(particle);
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkIfInView = () => {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Check if element is in viewport
            if (
                elementBottomPosition >= windowTopPosition && 
                elementTopPosition <= windowBottomPosition
            ) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', checkIfInView);
    checkIfInView(); // Check on page load
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Show error message
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Remove error message if exists
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Check login status
    checkLoginStatus();
}); 