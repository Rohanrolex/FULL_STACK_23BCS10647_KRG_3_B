// Booking functionality for BusTrak Bus Management System

document.addEventListener('DOMContentLoaded', function() {
    // Check if booking data exists in session storage (from search.js)
    const bookingData = JSON.parse(sessionStorage.getItem('currentBooking'));
    
    // If booking data exists, use it
    if (bookingData) {
        updateBookingInfoFromSession(bookingData);
    } else {
        // Otherwise use default/mock data
        // Get bus ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const busId = parseInt(urlParams.get('bus')) || 1; // Default to 1 if not provided
        const travelDate = urlParams.get('date') || getCurrentDate();
        
        // Get buses data from localStorage
        const buses = JSON.parse(localStorage.getItem('buses')) || [];
        const selectedBus = buses.find(bus => bus.busId === busId);
        
        if (!selectedBus) {
            alert('Bus not found. Redirecting to search page.');
            window.location.href = 'search.html';
            return;
        }
        
        // Update bus details
        updateBusDetails(selectedBus, travelDate);
    }
    
    // Generate seat layout - use mock data for demo
    generateSeatLayout();
    
    // Initialize booking button
    const bookButton = document.getElementById('bookButton');
    if (bookButton) {
        bookButton.addEventListener('click', function() {
            processSeatBooking();
        });
    }
});

// Update booking info from session storage
function updateBookingInfoFromSession(bookingData) {
    document.getElementById('busNumber').textContent = `BUS-${bookingData.busId}`;
    document.getElementById('busType').textContent = bookingData.busType;
    document.getElementById('busRoute').textContent = `${bookingData.from} to ${bookingData.to}`;
    document.getElementById('departure').textContent = `${bookingData.departureTime}, ${bookingData.date}`;
    document.getElementById('arrival').textContent = `${bookingData.arrivalTime}, ${bookingData.date}`;
    
    // Calculate duration (mock)
    const duration = "5h 30m"; // This would be calculated from departure and arrival
    document.getElementById('duration').textContent = duration;
    
    // Set fare
    document.getElementById('fare').textContent = `₹${bookingData.price} per seat`;
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().substr(0, 10);
}

// Update bus details on the page
function updateBusDetails(bus, travelDate) {
    document.getElementById('busNumber').textContent = bus.busNumber || "BUS-001";
    document.getElementById('busType').textContent = bus.busType || "Luxury AC";
    document.getElementById('busRoute').textContent = bus.route 
        ? `${bus.route.source} to ${bus.route.destination}` 
        : "Mumbai to Delhi";
    
    // Format travel date
    const formattedDate = formatDate(travelDate);
    
    // Format times (mock data if needed)
    const depTime = bus.departureTime ? formatTime(bus.departureTime) : "08:00 AM";
    const arrTime = bus.arrivalTime ? formatTime(bus.arrivalTime) : "06:00 PM";
    
    document.getElementById('departure').textContent = `${depTime}, ${formattedDate}`;
    document.getElementById('arrival').textContent = `${arrTime}, ${formattedDate}`;
    document.getElementById('duration').textContent = bus.route?.duration 
        ? formatDuration(bus.route.duration) 
        : "10h 00m";
    document.getElementById('fare').textContent = bus.fare 
        ? `₹${bus.fare.toFixed(0)} per seat` 
        : "₹1200 per seat";
}

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

// Format duration from HH:MM:SS to "HH hrs MM mins"
function formatDuration(durationString) {
    const parts = durationString.split(':');
    return `${parts[0]}h ${parts[1]}m`;
}

// Generate seat layout
function generateSeatLayout() {
    const seatLayout = document.getElementById('seatLayout');
    if (!seatLayout) return;
    
    seatLayout.innerHTML = '';
    
    // Get total number of seats (use 40 for standard bus)
    const totalSeats = 40;
    
    // Generate a random set of booked seats for demonstration (30% booked)
    const bookedSeats = generateRandomBookedSeats(totalSeats, Math.floor(totalSeats * 0.7));
    
    // Define the layout (5 seats per row with aisle)
    // 1-2 | 3-4-5 (2+3 format)
    const rows = totalSeats / 5;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < 5; col++) {
            const seatNumber = row * 5 + col + 1;
            
            // Skip for aisle (after 2nd seat in each row)
            if (col === 2 && row === 0) {
                // Add driver seat
                const driverSeat = document.createElement('div');
                driverSeat.className = 'seat booked';
                driverSeat.style.background = '#333';
                driverSeat.innerHTML = '<i class="fas fa-user-alt"></i>';
                driverSeat.title = 'Driver';
                driverSeat.style.gridColumnStart = 3;
                seatLayout.appendChild(driverSeat);
                continue;
            }
            
            // Create seat
            const seat = document.createElement('div');
            seat.className = 'seat';
            if (bookedSeats.includes(seatNumber)) {
                seat.className += ' booked';
            }
            seat.setAttribute('data-seat-number', seatNumber);
            seat.textContent = seatNumber;
            
            // Add click event for seat selection with animation
            seat.addEventListener('click', function() {
                if (!this.classList.contains('booked')) {
                    // Add animation class
                    this.classList.add('animate-select');
                    setTimeout(() => {
                        this.classList.remove('animate-select');
                    }, 300);
                    
                    this.classList.toggle('selected');
                    updateSelectedSeats();
                } else {
                    // Add shake animation for booked seats
                    this.classList.add('animate-shake');
                    setTimeout(() => {
                        this.classList.remove('animate-shake');
                    }, 500);
                }
            });
            
            // Add to layout
            seatLayout.appendChild(seat);
        }
    }
    
    // Add style for the animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-select {
            animation: pulse 0.3s ease-in-out;
        }
        
        .animate-shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Generate random booked seats for demonstration
function generateRandomBookedSeats(totalSeats, availableSeats) {
    const bookedCount = totalSeats - availableSeats;
    const bookedSeats = [];
    
    while (bookedSeats.length < bookedCount) {
        const randomSeat = Math.floor(Math.random() * totalSeats) + 1;
        if (!bookedSeats.includes(randomSeat)) {
            bookedSeats.push(randomSeat);
        }
    }
    
    return bookedSeats;
}

// Update selected seats info
function updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const selectedSeatsText = document.getElementById('selectedSeatsText');
    const seatCount = document.getElementById('seatCount');
    const seatCountPrice = document.getElementById('seatCountPrice');
    const baseFare = document.getElementById('baseFare');
    const taxAmount = document.getElementById('taxAmount');
    const totalFare = document.getElementById('totalFare');
    const bookButton = document.getElementById('bookButton');
    const passengerForm = document.getElementById('passengerForm');
    const passengerDetails = document.getElementById('passengerDetails');
    
    // Get selected seat numbers
    const seatNumbers = [];
    selectedSeats.forEach(seat => {
        seatNumbers.push(seat.getAttribute('data-seat-number'));
    });
    
    // Update seat information
    if (seatNumbers.length > 0) {
        selectedSeatsText.textContent = seatNumbers.join(', ');
        seatCount.textContent = seatNumbers.length;
        seatCountPrice.textContent = seatNumbers.length;
        
        // Calculate fares
        const farePerSeat = 1200; // Get this from the bus data
        const baseAmount = farePerSeat * seatNumbers.length;
        const tax = baseAmount * 0.05; // 5% tax
        const bookingFee = 20;
        const total = baseAmount + tax + bookingFee;
        
        baseFare.textContent = `₹${baseAmount.toFixed(0)}`;
        taxAmount.textContent = `₹${tax.toFixed(0)}`;
        totalFare.textContent = `₹${total.toFixed(0)}`;
        
        // Enable book button
        bookButton.disabled = false;
        
        // Show passenger details section with fade-in effect
        passengerDetails.classList.add('active');
        setTimeout(() => {
            // Generate passenger form
            generatePassengerForm(seatNumbers);
            passengerForm.classList.add('active');
        }, 300);
    } else {
        selectedSeatsText.textContent = 'None';
        seatCount.textContent = '0';
        seatCountPrice.textContent = '0';
        baseFare.textContent = '₹0';
        taxAmount.textContent = '₹0';
        totalFare.textContent = '₹0';
        
        // Disable book button
        bookButton.disabled = true;
        
        // Hide passenger form
        passengerForm.classList.remove('active');
        passengerDetails.classList.remove('active');
        setTimeout(() => {
            passengerForm.innerHTML = '';
        }, 300);
    }
}

// Generate passenger details form
function generatePassengerForm(seatNumbers) {
    const passengerForm = document.getElementById('passengerForm');
    if (!passengerForm) return;
    
    passengerForm.innerHTML = '';
    
    // Create a form for each passenger
    seatNumbers.forEach((seatNumber, index) => {
        const passengerDiv = document.createElement('div');
        passengerDiv.className = 'passenger';
        passengerDiv.innerHTML = `
            <h4>Passenger ${index + 1} - Seat ${seatNumber}</h4>
            <div class="form-group">
                <label for="passenger_name_${seatNumber}">Full Name</label>
                <input type="text" id="passenger_name_${seatNumber}" name="passenger_name_${seatNumber}" required>
            </div>
            <div class="form-group">
                <label for="passenger_age_${seatNumber}">Age</label>
                <input type="number" id="passenger_age_${seatNumber}" name="passenger_age_${seatNumber}" min="1" max="120" required>
            </div>
            <div class="form-group">
                <label for="passenger_gender_${seatNumber}">Gender</label>
                <select id="passenger_gender_${seatNumber}" name="passenger_gender_${seatNumber}" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
        `;
        
        passengerForm.appendChild(passengerDiv);
    });
}

// Process seat booking
function processSeatBooking() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to book tickets.');
        window.location.href = 'login.html';
        return;
    }
    
    // Get selected seats
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const seatNumbers = [];
    selectedSeats.forEach(seat => {
        seatNumbers.push(seat.getAttribute('data-seat-number'));
    });
    
    if (seatNumbers.length === 0) {
        alert('Please select at least one seat.');
        return;
    }
    
    // Validate passenger details
    const passengerForm = document.getElementById('passengerForm');
    const inputs = passengerForm.querySelectorAll('input, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        alert('Please fill all required passenger details.');
        return;
    }
    
    // Calculate fares
    const farePerSeat = 1200; // Get this from the bus data
    const baseAmount = farePerSeat * seatNumbers.length;
    const tax = baseAmount * 0.05; // 5% tax
    const bookingFee = 20;
    const total = baseAmount + tax + bookingFee;
    
    // Create booking object
    const booking = {
        bookingId: Date.now(),
        userId: currentUser.userId,
        busId: 1, // Assuming busId is always 1 for mock data
        busNumber: "BUS-001", // Assuming busNumber is always BUS-001 for mock data
        route: "Mumbai to Delhi", // Assuming route is always Mumbai to Delhi for mock data
        departureTime: "08:00 AM", // Assuming departureTime is always 08:00 AM for mock data
        arrivalTime: "06:00 PM", // Assuming arrivalTime is always 06:00 PM for mock data
        bookingDate: getCurrentDate(),
        travelDate: getCurrentDate(),
        seatNumbers: seatNumbers,
        totalSeats: seatNumbers.length,
        baseFare: baseAmount,
        tax: tax,
        bookingFee: bookingFee,
        totalFare: total,
        status: 'confirmed',
        paymentStatus: 'paid',
        passengers: []
    };
    
    // Collect passenger details
    seatNumbers.forEach((seatNumber, index) => {
        const name = document.getElementById(`passenger_name_${seatNumber}`).value;
        const age = document.getElementById(`passenger_age_${seatNumber}`).value;
        const gender = document.getElementById(`passenger_gender_${seatNumber}`).value;
        
        booking.passengers.push({
            name: name,
            age: age,
            gender: gender,
            seatNumber: seatNumber
        });
    });
    
    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success message
    alert('Booking successful! Your booking ID is ' + booking.bookingId);
    
    // Redirect to booking confirmation or dashboard
    window.location.href = 'booking_confirmation.html?id=' + booking.bookingId;
} 