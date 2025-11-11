// Customer Dashboard functionality for BusTrak Bus Management System

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.userType !== 'customer') {
        alert('Please login to access the customer dashboard.');
        window.location.href = 'login.html';
        return;
    }
    
    // Update user name in the welcome message
    document.getElementById('userName').textContent = currentUser.fullName;
    
    // Load user bookings
    loadUserBookings(currentUser.userId);
    
    // Load user profile information
    loadUserProfile(currentUser);
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

// Load user bookings
function loadUserBookings(userId) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const userBookings = bookings.filter(booking => booking.userId === userId);
    
    // If no bookings found
    if (userBookings.length === 0) {
        showNoBookingsMessage('allBookingsList');
        showNoBookingsMessage('upcomingBookingsList');
        showNoBookingsMessage('pastBookingsList');
        return;
    }
    
    // Sort bookings by travel date (newest first)
    userBookings.sort((a, b) => new Date(b.travelDate) - new Date(a.travelDate));
    
    // Display all bookings
    displayBookings('allBookingsList', userBookings);
    
    // Filter upcoming and past bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingBookings = userBookings.filter(booking => new Date(booking.travelDate) >= today);
    const pastBookings = userBookings.filter(booking => new Date(booking.travelDate) < today);
    
    // Display upcoming bookings
    if (upcomingBookings.length > 0) {
        displayBookings('upcomingBookingsList', upcomingBookings);
    } else {
        showNoBookingsMessage('upcomingBookingsList', 'No upcoming trips found. Book a new trip now!');
    }
    
    // Display past bookings
    if (pastBookings.length > 0) {
        displayBookings('pastBookingsList', pastBookings);
    } else {
        showNoBookingsMessage('pastBookingsList', 'No past trips found.');
    }
}

// Display bookings in the specified container
function displayBookings(containerId, bookings) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        
        // Format dates and times
        const travelDate = formatDate(booking.travelDate);
        const bookingDate = formatDate(booking.bookingDate);
        const departureTime = formatTime(booking.departureTime);
        const arrivalTime = formatTime(booking.arrivalTime);
        
        // Get status class
        const statusClass = `status-${booking.status.toLowerCase()}`;
        
        bookingCard.innerHTML = `
            <div class="booking-header">
                <div class="booking-title">${booking.route}</div>
                <div class="booking-status ${statusClass}">${booking.status.toUpperCase()}</div>
            </div>
            <div class="booking-details">
                <div class="detail-group">
                    <div class="detail-label">Booking ID</div>
                    <div class="detail-value">BT${booking.bookingId}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Travel Date</div>
                    <div class="detail-value">${travelDate}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Departure</div>
                    <div class="detail-value">${departureTime}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Arrival</div>
                    <div class="detail-value">${arrivalTime}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Seats</div>
                    <div class="detail-value">${booking.seatNumbers.join(', ')}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Amount Paid</div>
                    <div class="detail-value">₹${booking.totalFare.toFixed(2)}</div>
                </div>
            </div>
        `;
        
        // Add booking actions based on status and date
        const actionButtons = document.createElement('div');
        actionButtons.className = 'booking-actions';
        
        // View ticket button
        const viewButton = document.createElement('a');
        viewButton.href = `booking_confirmation.html?id=${booking.bookingId}`;
        viewButton.className = 'btn btn-small btn-primary';
        viewButton.textContent = 'View Ticket';
        actionButtons.appendChild(viewButton);
        
        // Cancel button (only for upcoming and confirmed bookings)
        const isFuture = new Date(booking.travelDate) > new Date();
        if (isFuture && booking.status === 'confirmed') {
            const cancelButton = document.createElement('button');
            cancelButton.className = 'btn btn-small btn-secondary';
            cancelButton.textContent = 'Cancel Booking';
            cancelButton.addEventListener('click', function() {
                cancelBooking(booking.bookingId);
            });
            actionButtons.appendChild(cancelButton);
        }
        
        bookingCard.appendChild(actionButtons);
        container.appendChild(bookingCard);
    });
}

// Show no bookings message
function showNoBookingsMessage(containerId, message = 'No bookings found.') {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="no-bookings">
            <p>${message}</p>
            <a href="search.html" class="btn btn-primary">Book a New Trip</a>
        </div>
    `;
}

// Cancel booking
function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const bookingIndex = bookings.findIndex(b => b.bookingId == bookingId);
        
        if (bookingIndex !== -1) {
            // Update booking status
            bookings[bookingIndex].status = 'cancelled';
            
            // Save updated bookings
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Reload the page to reflect changes
            alert('Booking cancelled successfully.');
            location.reload();
        }
    }
}

// Load user profile
function loadUserProfile(user) {
    // Find full user data (including fields not in the session)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userData = users.find(u => u.userId === user.userId) || user;
    
    // Update profile information
    document.getElementById('profileName').textContent = userData.fullName;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileUsername').textContent = userData.username;
    document.getElementById('profilePhone').textContent = userData.phone || 'Not provided';
    
    // Format created date
    const createdDate = userData.createdAt ? formatDate(userData.createdAt) : 'Not available';
    document.getElementById('profileCreated').textContent = createdDate;
    
    // Count total bookings
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const userBookings = bookings.filter(booking => booking.userId === user.userId);
    document.getElementById('profileBookings').textContent = userBookings.length;
}

// Format date for display
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', options);
}

// Format time from HH:MM:SS to HH:MM AM/PM
function formatTime(timeString) {
    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes} ${ampm}`;
} 