# CASA Backend API

Backend service for the CASA (Charitable App for Spiritual Artifacts) mobile application, which enables users to donate flower waste for recycling and earn points.

## Technologies Used

- Node.js & Express.js - Server framework
- Firebase - Authentication and database
- Firebase Admin SDK - Server-side Firebase interactions

## Project Structure

```
CASA-backend/
├── src/
│   ├── config/        # Configuration files (Firebase setup, etc.)
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Custom middleware (authentication, etc.)
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   └── index.js       # Application entry point
├── .env               # Environment variables
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a Firebase project and download the service account key
4. Create `.env` file with the following variables:
   ```
   PORT=5000
   FIREBASE_DATABASE_URL=your-database-url
   NODE_ENV=development
   ```
5. Place your Firebase service account key file in the project root (not committed to Git)
6. Update `src/config/firebase.js` to use your service account key
7. Start the development server: `npm run dev`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/reset-password` - Request password reset
- `GET /api/auth/me` - Get current user details (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Donations

- `POST /api/donations` - Create a new donation request (protected)
- `GET /api/donations/user` - Get all donations for current user (protected)
- `GET /api/donations/:donationId` - Get donation by ID (protected)
- `PUT /api/donations/:donationId/status` - Update donation status (admin only)

## Authentication

This API uses Firebase Authentication. Protected endpoints require a valid Firebase ID token to be included in the request header:

```
Authorization: Bearer <firebase-id-token>
```

## Development

Start the development server with automatic reloading:

```
npm run dev
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment variables
2. Build and start the server:

```
npm start
```

## License

This project is proprietary and confidential. 