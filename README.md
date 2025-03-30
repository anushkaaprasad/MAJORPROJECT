# Auditorium Booking System

A full-stack application for managing auditorium bookings with user and admin roles.

## Features

- **User Authentication**: Register, login, and user profiles
- **Booking Management**: Users can create, view, and cancel bookings
- **Admin Dashboard**: Admins can view, approve, and reject booking requests
- **Real-time Updates**: Get instant status updates on bookings
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

### Frontend
- **Next.js**: React framework for server-side rendering and routing
- **Material UI**: Component library for designing the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express**: Web framework for handling HTTP requests
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB
- **JWT**: JSON Web Tokens for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud instance)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/auditorium-booking-system.git
   cd auditorium-booking-system
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/auditorium_booking
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

4. Start the development servers
   ```
   # Start the backend server
   npm run server
   
   # In a separate terminal, start the frontend
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### User Flow

1. **Register/Login**: Create an account or log in to an existing one
2. **Book Auditorium**: Select date and time to create a booking request
3. **View Bookings**: Check the status of your bookings in the dashboard
4. **Cancel Bookings**: Cancel any pending bookings if needed

### Admin Flow

1. **Login as Admin**: Use admin credentials to access the admin dashboard
2. **View All Bookings**: See all booking requests across users
3. **Approve/Reject**: Manage booking requests by approving or rejecting them
4. **Search & Filter**: Find specific bookings using the search functionality

## Creating an Admin User

By default, all registered users have the 'user' role. To create an admin:

1. Register a new user through the UI
2. Connect to your MongoDB database (using MongoDB Compass or similar tool)
3. Find the user in the 'users' collection
4. Change the 'role' field from 'user' to 'admin'
5. Save the changes

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login with credentials
- `GET /api/auth/me`: Get current user info
- `GET /api/auth/logout`: Logout current user

### Bookings
- `GET /api/bookings`: Get all bookings
- `GET /api/bookings/:id`: Get a specific booking
- `POST /api/bookings`: Create a new booking
- `PUT /api/bookings/:id`: Update a booking
- `DELETE /api/bookings/:id`: Delete a booking
- `PUT /api/bookings/:id/approve`: Approve a booking (admin only)
- `PUT /api/bookings/:id/reject`: Reject a booking (admin only)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 