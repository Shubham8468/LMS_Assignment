# Loan Management System - Backend

## Overview
This repository contains the backend API for the Loan Management System (LMS). It provides a robust, secure, and scalable foundation for managing user authentication, loan processing, document uploads, and administrative controls. Built on Node.js and Express, it interacts with a MongoDB database to persist all transactional and user data.

## Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Language:** TypeScript
- **Authentication:** JSON Web Tokens (JWT) & BcryptJS
- **File Storage:** Cloudinary & Multer
- **Environment Management:** dotenv

## Architecture
The backend follows a standard Model-View-Controller (MVC) architectural pattern:
- `src/models/`: Mongoose schemas and database models.
- `src/controllers/`: Business logic and request handling.
- `src/routes/`: API endpoint definitions and route mapping.
- `src/middlewares/`: Request interceptors for authentication, validation, and error handling.
- `src/config/`: Configuration files for database connections and third-party services.
- `src/utils/`: Helper functions and standardized response formatters.

## Prerequisites
Ensure you have the following installed on your system:
- Node.js (v20 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)
- Cloudinary Account (for media uploads)

## Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

## Configuration
Create a `.env` file in the root of the backend directory. Populate it with the required configuration variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Running the Server
To start the server in development mode with hot-reloading:
```bash
npm run dev
```
The server will start, typically on port 5000, and connect to the configured MongoDB instance.

## API Documentation
Note: All protected routes require a valid JWT passed in the `Authorization` header as a `Bearer` token.

- **Authentication:** `/api/auth/*`
- **Users:** `/api/users/*`
- **Loans:** `/api/loans/*`

## Security and Standards
- **Passwords:** All passwords are mathematically hashed using Bcrypt before database insertion.
- **Validation:** Input validation is strictly enforced at the middleware level before reaching the controllers.
- **Error Handling:** A centralized error handling mechanism ensures consistent and predictable API responses for client applications.
