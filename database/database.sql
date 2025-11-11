-- Create database
CREATE DATABASE IF NOT EXISTS bus_management_system;
USE bus_management_system;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    user_type ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create bus companies table
CREATE TABLE IF NOT EXISTS bus_companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    bus_number VARCHAR(20) NOT NULL UNIQUE,
    bus_type VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL,
    status ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES bus_companies(company_id)
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    duration TIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    route_id INT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    status ENUM('active', 'cancelled', 'delayed') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id),
    FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    schedule_id INT NOT NULL,
    booking_date DATE NOT NULL,
    travel_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)
);

-- Create passengers table
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    seat_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('credit_card', 'debit_card', 'net_banking', 'upi', 'wallet') NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bus_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id)
);

-- Insert sample users
INSERT INTO users (username, password, email, full_name, phone, user_type, created_at) VALUES
('admin', 'admin123', 'admin@bustrak.com', 'Admin User', '9876543210', 'admin', NOW()),
('john_doe', 'password123', 'john@example.com', 'John Doe', '9876543211', 'customer', NOW()),
('jane_smith', 'password123', 'jane@example.com', 'Jane Smith', '9876543212', 'customer', NOW()),
('mike_wilson', 'password123', 'mike@example.com', 'Mike Wilson', '9876543213', 'customer', NOW()),
('sarah_jones', 'password123', 'sarah@example.com', 'Sarah Jones', '9876543214', 'customer', NOW());

-- Insert sample bus companies
INSERT INTO bus_companies (name, contact_number, email, address, created_at) VALUES
('RedBus', '1800123456', 'support@redbus.com', '123 Bus Lane, Mumbai', NOW()),
('Volvo Buses', '1800123457', 'support@volvo.com', '456 Highway Road, Delhi', NOW()),
('SRS Travels', '1800123458', 'support@srs.com', '789 Travel Street, Bangalore', NOW()),
('KPN Travels', '1800123459', 'support@kpn.com', '321 Journey Road, Chennai', NOW()),
('Orange Travels', '1800123460', 'support@orange.com', '654 Trip Avenue, Hyderabad', NOW());

-- Insert sample buses
INSERT INTO buses (company_id, bus_number, bus_type, total_seats, status, created_at) VALUES
(1, 'BUS-001', 'Luxury AC', 40, 'active', NOW()),
(1, 'BUS-002', 'Sleeper', 35, 'active', NOW()),
(2, 'BUS-003', 'Deluxe', 45, 'active', NOW()),
(2, 'BUS-004', 'Luxury AC', 40, 'active', NOW()),
(3, 'BUS-005', 'Sleeper', 35, 'active', NOW()),
(3, 'BUS-006', 'Deluxe', 45, 'active', NOW()),
(4, 'BUS-007', 'Luxury AC', 40, 'active', NOW()),
(4, 'BUS-008', 'Sleeper', 35, 'active', NOW()),
(5, 'BUS-009', 'Deluxe', 45, 'active', NOW()),
(5, 'BUS-010', 'Luxury AC', 40, 'active', NOW());

-- Insert sample routes
INSERT INTO routes (source, destination, distance, duration, price, status, created_at) VALUES
('Mumbai', 'Delhi', 1400, '24:00:00', 1200.00, 'active', NOW()),
('Delhi', 'Mumbai', 1400, '24:00:00', 1200.00, 'active', NOW()),
('Bangalore', 'Chennai', 350, '06:00:00', 500.00, 'active', NOW()),
('Chennai', 'Bangalore', 350, '06:00:00', 500.00, 'active', NOW()),
('Hyderabad', 'Bangalore', 570, '10:00:00', 800.00, 'active', NOW()),
('Bangalore', 'Hyderabad', 570, '10:00:00', 800.00, 'active', NOW()),
('Mumbai', 'Bangalore', 1000, '18:00:00', 900.00, 'active', NOW()),
('Bangalore', 'Mumbai', 1000, '18:00:00', 900.00, 'active', NOW()),
('Delhi', 'Chennai', 2200, '36:00:00', 1500.00, 'active', NOW()),
('Chennai', 'Delhi', 2200, '36:00:00', 1500.00, 'active', NOW());

-- Insert sample schedules
INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, status, created_at) VALUES
(1, 1, '08:00:00', '08:00:00', 'active', NOW()),
(2, 2, '09:00:00', '09:00:00', 'active', NOW()),
(3, 3, '10:00:00', '16:00:00', 'active', NOW()),
(4, 4, '11:00:00', '17:00:00', 'active', NOW()),
(5, 5, '12:00:00', '22:00:00', 'active', NOW()),
(6, 6, '13:00:00', '23:00:00', 'active', NOW()),
(7, 7, '14:00:00', '08:00:00', 'active', NOW()),
(8, 8, '15:00:00', '09:00:00', 'active', NOW()),
(9, 9, '16:00:00', '04:00:00', 'active', NOW()),
(10, 10, '17:00:00', '05:00:00', 'active', NOW());

-- Insert sample bookings
INSERT INTO bookings (user_id, schedule_id, booking_date, travel_date, total_amount, status, payment_status, created_at) VALUES
(2, 1, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1200.00, 'confirmed', 'paid', NOW()),
(3, 2, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1200.00, 'confirmed', 'paid', NOW()),
(4, 3, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 500.00, 'confirmed', 'paid', NOW()),
(5, 4, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 500.00, 'confirmed', 'paid', NOW()),
(2, 5, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 800.00, 'confirmed', 'paid', NOW());

-- Insert sample passengers
INSERT INTO passengers (booking_id, name, age, gender, seat_number, created_at) VALUES
(1, 'John Doe', 25, 'male', 1, NOW()),
(1, 'Jane Smith', 24, 'female', 2, NOW()),
(2, 'Mike Wilson', 30, 'male', 3, NOW()),
(3, 'Sarah Jones', 28, 'female', 4, NOW()),
(4, 'John Doe', 25, 'male', 5, NOW()),
(5, 'Jane Smith', 24, 'female', 6, NOW());

-- Insert sample payments
INSERT INTO payments (booking_id, amount, payment_method, transaction_id, status, created_at) VALUES
(1, 1200.00, 'credit_card', 'TXN123456', 'completed', NOW()),
(2, 1200.00, 'debit_card', 'TXN123457', 'completed', NOW()),
(3, 500.00, 'net_banking', 'TXN123458', 'completed', NOW()),
(4, 500.00, 'upi', 'TXN123459', 'completed', NOW()),
(5, 800.00, 'credit_card', 'TXN123460', 'completed', NOW());

-- Insert sample reviews
INSERT INTO reviews (user_id, bus_id, rating, comment, created_at) VALUES
(2, 1, 5, 'Excellent service and comfortable journey', NOW()),
(3, 2, 4, 'Good experience overall', NOW()),
(4, 3, 5, 'Very clean and well-maintained bus', NOW()),
(5, 4, 4, 'Punctual and professional service', NOW()),
(2, 5, 5, 'Great value for money', NOW());  