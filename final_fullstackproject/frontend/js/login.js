// Login functionality for BusTrak Bus Management System

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate API call - in a real app, you'd send a request to your backend
            simulateLogin(email, password);
        });
    }
    
    function simulateLogin(email, password) {
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;
        
        // Simulate network delay
        setTimeout(function() {
            // In a real app, you'd validate credentials against your backend
            if (email.includes('@') && password.length >= 6) {
                // Success
                showMessage('Login successful!', 'success');
                
                // Store login state
                localStorage.setItem('user', JSON.stringify({
                    email: email,
                    isLoggedIn: true,
                    loginTime: new Date().getTime()
                }));
                
                // Redirect to dashboard/home
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                // Failed login
                showMessage('Invalid email or password', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
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
        
        // Auto remove after delay
        setTimeout(function() {
            messageElement.classList.add('fade-out');
            setTimeout(function() {
                messageElement.remove();
            }, 500);
        }, 3000);
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