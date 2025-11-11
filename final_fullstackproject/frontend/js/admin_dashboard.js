document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.userType !== 'admin') {
        alert('Access denied. Please login as admin.');
        window.location.href = 'login.html';
        return;
    }

    // Set admin name
    document.getElementById('user-name').textContent = currentUser.fullName || 'Admin';

    // Initialize dashboard
    initializeTabs();
    loadDashboardStats();
    loadBuses();
    loadRoutes();
    loadBookings();
    loadUsers();
    setupModalHandlers();
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Deactivate all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activate selected tab
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Load dashboard statistics
function loadDashboardStats() {
    // Get data from local storage
    const buses = getBuses();
    const routes = getRoutes();
    const bookings = getBookings();
    const users = getUsers();
    
    // Update stats on dashboard
    document.getElementById('total-buses').textContent = buses.length;
    document.getElementById('total-routes').textContent = routes.length;
    document.getElementById('total-bookings').textContent = bookings.length;
    document.getElementById('total-users').textContent = users.length;
}

// Get buses from local storage
function getBuses() {
    const busesJSON = localStorage.getItem('buses');
    return busesJSON ? JSON.parse(busesJSON) : [];
}

// Get routes from local storage
function getRoutes() {
    const routesJSON = localStorage.getItem('routes');
    return routesJSON ? JSON.parse(routesJSON) : [];
}

// Get bookings from local storage
function getBookings() {
    const bookingsJSON = localStorage.getItem('bookings');
    return bookingsJSON ? JSON.parse(bookingsJSON) : [];
}

// Get users from local storage
function getUsers() {
    const usersJSON = localStorage.getItem('users');
    return usersJSON ? JSON.parse(usersJSON) : [];
}

// Load buses into table
function loadBuses() {
    const buses = getBuses();
    const tableBody = document.querySelector('#buses-table tbody');
    tableBody.innerHTML = '';
    
    if (buses.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center">No buses found. Add a new bus to get started.</td>`;
        tableBody.appendChild(row);
        return;
    }
    
    buses.forEach(bus => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${bus.id || '-'}</td>
            <td>${bus.busNumber}</td>
            <td>${bus.busType}</td>
            <td>${bus.totalSeats}</td>
            <td><span class="status-badge status-${bus.status ? bus.status.toLowerCase() : (bus.isActive ? 'active' : 'inactive')}">${bus.status || (bus.isActive ? 'Active' : 'Inactive')}</span></td>
            <td class="action-buttons">
                <button class="btn btn-small btn-primary edit-bus" data-id="${bus.id}">Edit</button>
                <button class="btn btn-small btn-danger delete-bus" data-id="${bus.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners for edit and delete buttons
    addBusActionListeners();
}

// Add event listeners for bus action buttons
function addBusActionListeners() {
    // Edit bus event listeners
    document.querySelectorAll('.edit-bus').forEach(button => {
        button.addEventListener('click', function() {
            const busId = this.getAttribute('data-id');
            editBus(busId);
        });
    });
    
    // Delete bus event listeners
    document.querySelectorAll('.delete-bus').forEach(button => {
        button.addEventListener('click', function() {
            const busId = this.getAttribute('data-id');
            deleteBus(busId);
        });
    });
}

// Edit bus
function editBus(busId) {
    const buses = getBuses();
    const bus = buses.find(b => b.id === busId);
    
    if (!bus) return;
    
    // Set form mode to edit
    document.getElementById('bus-modal-title').textContent = 'Edit Bus';
    
    // Populate form fields
    document.getElementById('bus-id').value = bus.id;
    document.getElementById('bus-number').value = bus.busNumber;
    document.getElementById('bus-type').value = bus.busType;
    document.getElementById('bus-capacity').value = bus.totalSeats;
    document.getElementById('bus-status').value = bus.status || (bus.isActive ? 'Active' : 'Inactive');
    
    // Show modal
    toggleModal('bus-modal', true);
}

// Delete bus
function deleteBus(busId) {
    if (confirm('Are you sure you want to delete this bus?')) {
        const buses = getBuses();
        const updatedBuses = buses.filter(bus => bus.id !== busId);
        
        localStorage.setItem('buses', JSON.stringify(updatedBuses));
        
        // Reload buses and update stats
        loadBuses();
        loadDashboardStats();
        
        alert('Bus deleted successfully!');
    }
}

// Load routes into table
function loadRoutes() {
    const routes = getRoutes();
    const tableBody = document.querySelector('#routes-table tbody');
    tableBody.innerHTML = '';
    
    if (routes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="text-center">No routes found. Add a new route to get started.</td>`;
        tableBody.appendChild(row);
        return;
    }
    
    routes.forEach(route => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${route.id || '-'}</td>
            <td>${route.source || route.from}</td>
            <td>${route.destination || route.to}</td>
            <td>${route.distance} km</td>
            <td>${route.duration} hrs</td>
            <td>$${route.price || '0.00'}</td>
            <td class="action-buttons">
                <button class="btn btn-small btn-primary edit-route" data-id="${route.id}">Edit</button>
                <button class="btn btn-small btn-danger delete-route" data-id="${route.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners for edit and delete buttons
    addRouteActionListeners();
}

// Add event listeners for route action buttons
function addRouteActionListeners() {
    // Edit route event listeners
    document.querySelectorAll('.edit-route').forEach(button => {
        button.addEventListener('click', function() {
            const routeId = this.getAttribute('data-id');
            editRoute(routeId);
        });
    });
    
    // Delete route event listeners
    document.querySelectorAll('.delete-route').forEach(button => {
        button.addEventListener('click', function() {
            const routeId = this.getAttribute('data-id');
            deleteRoute(routeId);
        });
    });
}

// Edit route
function editRoute(routeId) {
    const routes = getRoutes();
    const route = routes.find(r => r.id === routeId);
    
    if (!route) return;
    
    // Set form mode to edit
    document.getElementById('route-modal-title').textContent = 'Edit Route';
    
    // Populate form fields
    document.getElementById('route-id').value = route.id;
    document.getElementById('route-from').value = route.source || route.from;
    document.getElementById('route-to').value = route.destination || route.to;
    document.getElementById('route-distance').value = route.distance;
    document.getElementById('route-duration').value = route.duration;
    document.getElementById('route-price').value = route.price || '0.00';
    
    // Show modal
    toggleModal('route-modal', true);
}

// Delete route
function deleteRoute(routeId) {
    // Check if route is used by any bus
    const buses = getBuses();
    const routeInUse = buses.some(bus => bus.routeId === routeId);
    
    if (routeInUse) {
        alert('This route cannot be deleted as it is used by one or more buses. Please update the buses first.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this route?')) {
        const routes = getRoutes();
        const updatedRoutes = routes.filter(route => route.id !== routeId);
        
        localStorage.setItem('routes', JSON.stringify(updatedRoutes));
        
        // Reload routes and update stats
        loadRoutes();
        loadDashboardStats();
        
        alert('Route deleted successfully!');
    }
}

// Load bookings into table
function loadBookings() {
    const bookings = getBookings();
    const users = getUsers();
    const buses = getBuses();
    const tableBody = document.querySelector('#bookings-table tbody');
    tableBody.innerHTML = '';
    
    if (bookings.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" class="text-center">No bookings found.</td>`;
        tableBody.appendChild(row);
        return;
    }
    
    bookings.forEach(booking => {
        const user = users.find(u => u.id === booking.userId || u.userId === booking.userId) || { fullName: 'Unknown User' };
        const bus = buses.find(b => b.id === booking.busId) || { busNumber: 'Unknown' };
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${booking.bookingId || booking.id || '-'}</td>
            <td>${user.fullName || user.username || 'Unknown'}</td>
            <td>${booking.route || 'N/A'}</td>
            <td>${formatDate(booking.travelDate)}</td>
            <td>${bus.busNumber || 'N/A'}</td>
            <td>${(booking.seatNumbers || booking.seats || []).join(', ')}</td>
            <td><span class="status-badge status-${(booking.status || 'pending').toLowerCase()}">${booking.status || 'Pending'}</span></td>
            <td class="action-buttons">
                <button class="btn btn-small btn-primary edit-booking" data-id="${booking.bookingId || booking.id}">Update</button>
                <button class="btn btn-small btn-danger delete-booking" data-id="${booking.bookingId || booking.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners for action buttons
    addBookingActionListeners();
}

// Format date to readable format
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add event listeners for booking action buttons
function addBookingActionListeners() {
    // Edit booking event listeners
    document.querySelectorAll('.edit-booking').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            editBooking(bookingId);
        });
    });
    
    // Delete booking event listeners
    document.querySelectorAll('.delete-booking').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            deleteBooking(bookingId);
        });
    });
}

// Edit booking
function editBooking(bookingId) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.bookingId === bookingId || b.id === bookingId);
    
    if (!booking) return;
    
    // Populate form fields
    document.getElementById('booking-id').value = bookingId;
    document.getElementById('booking-status').value = booking.status || 'Pending';
    
    // Show modal
    toggleModal('booking-modal', true);
}

// Delete booking
function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        const bookings = getBookings();
        const updatedBookings = bookings.filter(booking => (booking.bookingId !== bookingId && booking.id !== bookingId));
        
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        
        // Reload bookings and update stats
        loadBookings();
        loadDashboardStats();
        
        alert('Booking deleted successfully!');
    }
}

// Load users into table
function loadUsers() {
    const users = getUsers();
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center">No users found.</td>`;
        tableBody.appendChild(row);
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.id || user.userId || '-'}</td>
            <td>${user.fullName || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.userType || user.role || 'user'}</td>
            <td>${formatDate(user.createdAt || user.joinedDate)}</td>
            <td class="action-buttons">
                <button class="btn btn-small btn-primary edit-user" data-id="${user.id || user.userId}">Edit Role</button>
                <button class="btn btn-small btn-danger delete-user" data-id="${user.id || user.userId}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners for action buttons
    addUserActionListeners();
}

// Add event listeners for user action buttons
function addUserActionListeners() {
    // Edit user event listeners
    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            editUser(userId);
        });
    });
    
    // Delete user event listeners
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            deleteUser(userId);
        });
    });
}

// Edit user
function editUser(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId || u.userId === userId);
    
    if (!user) return;
    
    // Populate form fields
    document.getElementById('user-id').value = userId;
    document.getElementById('user-role').value = user.userType || user.role || 'user';
    
    // Show modal
    toggleModal('user-modal', true);
}

// Delete user
function deleteUser(userId) {
    // Check if user is current admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if ((currentUser.id === userId) || (currentUser.userId === userId)) {
        alert('You cannot delete your own account.');
        return;
    }
    
    // Check if user has bookings
    const bookings = getBookings();
    const userHasBookings = bookings.some(booking => booking.userId === userId);
    
    if (userHasBookings) {
        alert('This user cannot be deleted as they have active bookings. Delete the bookings first.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
        const users = getUsers();
        const updatedUsers = users.filter(user => (user.id !== userId && user.userId !== userId));
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Reload users and update stats
        loadUsers();
        loadDashboardStats();
        
        alert('User deleted successfully!');
    }
}

// Setup modal handlers
function setupModalHandlers() {
    // Add bus button
    document.getElementById('add-bus-btn').addEventListener('click', function() {
        // Reset form
        document.getElementById('bus-form').reset();
        document.getElementById('bus-id').value = '';
        
        // Change modal title
        document.getElementById('bus-modal-title').textContent = 'Add New Bus';
        
        // Show modal
        toggleModal('bus-modal', true);
    });
    
    // Add route button
    document.getElementById('add-route-btn').addEventListener('click', function() {
        // Reset form
        document.getElementById('route-form').reset();
        document.getElementById('route-id').value = '';
        
        // Change modal title
        document.getElementById('route-modal-title').textContent = 'Add New Route';
        
        // Show modal
        toggleModal('route-modal', true);
    });
    
    // Close modals
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal-container').id;
            toggleModal(modalId, false);
        });
    });
    
    // Cancel buttons
    document.querySelectorAll('[id$="-cancel-btn"]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal-container').id;
            toggleModal(modalId, false);
        });
    });
    
    // Save bus
    document.getElementById('save-bus-btn').addEventListener('click', function() {
        saveBus();
    });
    
    // Save route
    document.getElementById('save-route-btn').addEventListener('click', function() {
        saveRoute();
    });
    
    // Save booking
    document.getElementById('save-booking-btn').addEventListener('click', function() {
        saveBooking();
    });
    
    // Save user
    document.getElementById('save-user-btn').addEventListener('click', function() {
        saveUser();
    });
}

// Toggle modal
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (show) {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}

// Save bus
function saveBus() {
    // Validate form
    const form = document.getElementById('bus-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const busId = document.getElementById('bus-id').value;
    const buses = getBuses();
    
    // Get form data
    const busData = {
        busNumber: document.getElementById('bus-number').value,
        busType: document.getElementById('bus-type').value,
        totalSeats: parseInt(document.getElementById('bus-capacity').value),
        status: document.getElementById('bus-status').value,
        isActive: document.getElementById('bus-status').value === 'Active'
    };
    
    if (busId) {
        // Edit existing bus
        const busIndex = buses.findIndex(bus => bus.id === busId);
        
        if (busIndex !== -1) {
            buses[busIndex] = {
                ...buses[busIndex],
                ...busData
            };
            
            alert('Bus updated successfully!');
        }
    } else {
        // Add new bus
        busData.id = generateId();
        buses.push(busData);
        
        alert('Bus added successfully!');
    }
    
    // Save to local storage
    localStorage.setItem('buses', JSON.stringify(buses));
    
    // Close modal
    toggleModal('bus-modal', false);
    
    // Reload buses and update stats
    loadBuses();
    loadDashboardStats();
}

// Save route
function saveRoute() {
    // Validate form
    const form = document.getElementById('route-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const routeId = document.getElementById('route-id').value;
    const routes = getRoutes();
    
    // Get form data
    const routeData = {
        source: document.getElementById('route-from').value,
        from: document.getElementById('route-from').value,
        destination: document.getElementById('route-to').value,
        to: document.getElementById('route-to').value,
        distance: parseFloat(document.getElementById('route-distance').value),
        duration: parseFloat(document.getElementById('route-duration').value),
        price: parseFloat(document.getElementById('route-price').value)
    };
    
    if (routeId) {
        // Edit existing route
        const routeIndex = routes.findIndex(route => route.id === routeId);
        
        if (routeIndex !== -1) {
            routes[routeIndex] = {
                ...routes[routeIndex],
                ...routeData
            };
            
            alert('Route updated successfully!');
        }
    } else {
        // Add new route
        routeData.id = generateId();
        routes.push(routeData);
        
        alert('Route added successfully!');
    }
    
    // Save to local storage
    localStorage.setItem('routes', JSON.stringify(routes));
    
    // Close modal
    toggleModal('route-modal', false);
    
    // Reload routes and update stats
    loadRoutes();
    loadDashboardStats();
}

// Save booking
function saveBooking() {
    const bookingId = document.getElementById('booking-id').value;
    const bookings = getBookings();
    const bookingIndex = bookings.findIndex(b => b.bookingId === bookingId || b.id === bookingId);
    
    if (bookingIndex === -1) return;
    
    // Update booking status
    bookings[bookingIndex].status = document.getElementById('booking-status').value;
    
    // Save to local storage
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Close modal
    toggleModal('booking-modal', false);
    
    // Reload bookings
    loadBookings();
    
    alert('Booking status updated successfully!');
}

// Save user
function saveUser() {
    const userId = document.getElementById('user-id').value;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId || u.userId === userId);
    
    if (userIndex === -1) return;
    
    // Update user role
    const newRole = document.getElementById('user-role').value;
    users[userIndex].userType = newRole;
    users[userIndex].role = newRole;
    
    // Save to local storage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Close modal
    toggleModal('user-modal', false);
    
    // Reload users
    loadUsers();
    
    alert('User role updated successfully!');
}

// Generate a unique ID
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Initialize demo data if none exists
function initializeDemoData() {
    // Check if data already exists
    if (!localStorage.getItem('buses')) {
        // Add demo buses
        const demoBuses = [
            {
                id: 'bus1',
                busNumber: 'BT-1001',
                busType: 'Standard',
                totalSeats: 36,
                status: 'Active',
                isActive: true
            },
            {
                id: 'bus2',
                busNumber: 'BT-1002',
                busType: 'Premium',
                totalSeats: 30,
                status: 'Active',
                isActive: true
            },
            {
                id: 'bus3',
                busNumber: 'BT-1003',
                busType: 'Luxury',
                totalSeats: 24,
                status: 'Maintenance',
                isActive: false
            }
        ];
        localStorage.setItem('buses', JSON.stringify(demoBuses));
    }
    
    if (!localStorage.getItem('routes')) {
        // Add demo routes
        const demoRoutes = [
            {
                id: 'route1',
                source: 'New York',
                from: 'New York',
                destination: 'Boston',
                to: 'Boston',
                distance: 346,
                duration: 4.5,
                price: 45.99
            },
            {
                id: 'route2',
                source: 'Chicago',
                from: 'Chicago',
                destination: 'Detroit',
                to: 'Detroit',
                distance: 455,
                duration: 5.0,
                price: 55.50
            },
            {
                id: 'route3',
                source: 'San Francisco',
                from: 'San Francisco',
                destination: 'Los Angeles',
                to: 'Los Angeles',
                distance: 615,
                duration: 8.5,
                price: 75.00
            }
        ];
        localStorage.setItem('routes', JSON.stringify(demoRoutes));
    }
    
    if (!localStorage.getItem('users')) {
        // Add demo users
        const today = new Date();
        const demoUsers = [
            {
                id: 'admin1',
                userId: 'admin1',
                fullName: 'Admin User',
                username: 'admin',
                email: 'admin@bussystem.com',
                password: 'admin123',
                userType: 'admin',
                role: 'admin',
                createdAt: today.toISOString()
            },
            {
                id: 'user1',
                userId: 'user1',
                fullName: 'John Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123',
                userType: 'customer',
                role: 'user',
                createdAt: today.toISOString()
            },
            {
                id: 'user2',
                userId: 'user2',
                fullName: 'Jane Smith',
                username: 'janesmith',
                email: 'jane@example.com',
                password: 'password123',
                userType: 'customer',
                role: 'user',
                createdAt: today.toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
    
    if (!localStorage.getItem('bookings')) {
        // Add demo bookings
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const demoBookings = [
            {
                bookingId: 'BK-1001',
                id: 'BK-1001',
                userId: 'user1',
                busId: 'bus1',
                route: 'New York to Boston',
                travelDate: tomorrow.toISOString().split('T')[0],
                bookingDate: today.toISOString(),
                seatNumbers: ['A1', 'A2'],
                seats: ['A1', 'A2'],
                totalFare: 91.98,
                status: 'Confirmed'
            },
            {
                bookingId: 'BK-1002',
                id: 'BK-1002',
                userId: 'user2',
                busId: 'bus2',
                route: 'Chicago to Detroit',
                travelDate: nextWeek.toISOString().split('T')[0],
                bookingDate: today.toISOString(),
                seatNumbers: ['B3'],
                seats: ['B3'],
                totalFare: 55.50,
                status: 'Pending'
            }
        ];
        localStorage.setItem('bookings', JSON.stringify(demoBookings));
    }
}

// Call initialize demo data on load
initializeDemoData(); 