// Booking confirmation functionality for BusTrak Bus Management System

document.addEventListener('DOMContentLoaded', function() {
    // Get booking ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('id');
    
    // If no booking ID is provided, redirect to home
    if (!bookingId) {
        alert('No booking information found. Redirecting to home page.');
        window.location.href = 'index.html';
        return;
    }
    
    // Get bookings data from localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.bookingId == bookingId);
    
    if (!booking) {
        alert('Booking not found. Redirecting to home page.');
        window.location.href = 'index.html';
        return;
    }
    
    // Display booking information
    displayBookingDetails(booking);
    
    // Initialize print button
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
});

// Format date to display
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

// Display booking details on the page
function displayBookingDetails(booking) {
    // Update ticket details
    document.getElementById('bookingId').textContent = 'BT' + booking.bookingId;
    document.getElementById('bookingDate').textContent = formatDate(booking.bookingDate);
    document.getElementById('travelDate').textContent = formatDate(booking.travelDate);
    document.getElementById('seats').textContent = booking.seatNumbers.join(', ');
    document.getElementById('totalSeats').textContent = booking.totalSeats;
    
    // Update bus details
    document.getElementById('busNumber').textContent = booking.busNumber;
    document.getElementById('route').textContent = booking.route;
    
    // Format departure and arrival times
    const depTime = formatTime(booking.departureTime);
    const arrTime = formatTime(booking.arrivalTime);
    
    document.getElementById('departure').textContent = `${depTime}, ${formatDate(booking.travelDate)}`;
    document.getElementById('arrival').textContent = `${arrTime}, ${formatDate(booking.travelDate)}`;
    
    // Update fare details
    document.getElementById('baseFare').textContent = '₹' + booking.baseFare.toFixed(2);
    document.getElementById('taxAmount').textContent = '₹' + booking.tax.toFixed(2);
    document.getElementById('bookingFee').textContent = '₹' + booking.bookingFee.toFixed(2);
    document.getElementById('totalFare').textContent = '₹' + booking.totalFare.toFixed(2);
    document.getElementById('paymentStatus').textContent = booking.paymentStatus.toUpperCase();
    
    // Display passenger details
    const passengersList = document.getElementById('passengersList');
    passengersList.innerHTML = '';
    
    booking.passengers.forEach((passenger, index) => {
        const passengerCard = document.createElement('div');
        passengerCard.className = 'passenger-card';
        
        passengerCard.innerHTML = `
            <div class="info-item">
                <span class="info-label">Passenger ${index + 1}:</span>
                <span>${passenger.name}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Age:</span>
                <span>${passenger.age}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Gender:</span>
                <span>${passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Seat Number:</span>
                <span>${passenger.seatNumber}</span>
            </div>
        `;
        
        passengersList.appendChild(passengerCard);
    });
} 