# BusTrak - Bus Management System

BusTrak is a comprehensive bus management system that helps users search for buses, book tickets, and manage their bookings. The system uses SQL for database management and HTML, CSS, and JavaScript for frontend development.

## Features

- **User Authentication**: Register and login functionality
- **Bus Search**: Search buses by source, destination, date, and bus type
- **Seat Selection**: Interactive seat selection with visual representation
- **Booking Management**: Book tickets, view booking history, and cancel bookings
- **Ticket Generation**: Generate and print electronic tickets
- **Admin Dashboard**: Manage buses, routes, and bookings (for admin users)

## Unique Features

- **Interactive Seat Layout**: Visual seat selection system
- **Real-time Fare Calculation**: Dynamic fare calculation based on selected seats
- **E-Ticket System**: Downloadable and printable e-tickets
- **Booking History**: Track all past and upcoming journeys

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQL
- **Data Storage**: Local Storage (for demo purposes)

## Project Structure

```
Bus Management System/
├── database/
│   └── bus_management.sql    # SQL database schema
├── frontend/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── js/
│   │   ├── script.js         # Main JavaScript file
│   │   ├── login.js          # Login functionality
│   │   ├── register.js       # Registration functionality
│   │   ├── search.js         # Bus search functionality
│   │   ├── booking.js        # Booking functionality
│   │   └── booking_confirmation.js  # Ticket confirmation
│   ├── index.html            # Home page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── search.html           # Bus search page
│   ├── booking.html          # Seat booking page
│   └── booking_confirmation.html  # Booking confirmation page
└── README.md                  # Project documentation
```

## Setup Instructions

1. **Database Setup**:
   - Create a MySQL database named `bus_management`
   - Import the `database/bus_management.sql` file to set up the schema and sample data

2. **Application Setup**:
   - Clone the repository to your local machine or web server
   - No additional setup is required for the frontend as it uses plain HTML, CSS, and JavaScript

3. **Access the Application**:
   - Open `frontend/index.html` in your web browser
   - For admin access, use username: `admin` and password: `admin123`
   - For customer access, register a new account

## Demo Accounts

- **Admin**: Username: `admin`, Password: `admin123`
- **Customer**: Register a new account

## Customization

- Modify the `database/bus_management.sql` file to add more buses, routes, or features
- Update the CSS in `frontend/css/style.css` to customize the appearance
- Extend functionality by adding more JavaScript in the respective files

## Future Enhancements

- Online payment integration
- SMS notifications for bookings
- Bus tracking system
- Feedback and rating system
- Multilingual support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 