// Registration functionality for BusTrak Bus Management System

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate form
            if (!validateForm(firstName, lastName, email, phone, password, confirmPassword)) {
                return;
            }
            
            // Simulate API call
            registerUser(firstName, lastName, email, phone, password);
        });
    }
    
    function validateForm(firstName, lastName, email, phone, password, confirmPassword) {
        // Check for empty fields
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            showMessage('Please fill in all fields', 'error');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return false;
        }
        
        // Validate phone format (simple validation)
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(phone.replace(/[^\d]/g, ''))) {
            showMessage('Please enter a valid phone number', 'error');
            return false;
        }
        
        // Validate password length
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return false;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return false;
        }
        
        return true;
    }
    
    function registerUser(firstName, lastName, email, phone, password) {
        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;
        
        // Simulate network delay
        setTimeout(function() {
            // In a real app, you'd send this data to your backend API
            
            // Check if email already exists (simulate)
            const emailExists = Math.random() < 0.3; // 30% chance to simulate existing email
            
            if (emailExists) {
                showMessage('Email already registered. Please use a different email or login instead.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Success - store user data (in a real app, this would be handled by the backend)
            const userData = {
                firstName,
                lastName,
                email,
                phone,
                isLoggedIn: true,
                registrationDate: new Date().toISOString()
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Show success message
            showMessage('Registration successful! Redirecting to homepage...', 'success');
            
            // Redirect to home/dashboard
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 2000);
            
        }, 1500);
    }
    
    function showMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.innerHTML = `<p>${message}</p>`;
        
        // Add to DOM
        const formActions = document.querySelector('.form-actions');
        formActions.parentNode.insertBefore(messageElement, formActions);
        
        // Auto remove after delay (only for non-success messages)
        if (type !== 'success') {
            setTimeout(function() {
                messageElement.classList.add('fade-out');
                setTimeout(function() {
                    messageElement.remove();
                }, 500);
            }, 4000);
        }
    }
    
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Redirect based on user type
        if (currentUser.userType === 'admin') {
            window.location.href = 'admin_dashboard.html';
        } else {
            window.location.href = 'customer_dashboard.html';
        }
    }
}); 