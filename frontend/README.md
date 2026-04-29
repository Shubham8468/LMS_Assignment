# Loan Management System - Frontend

## Overview
This repository contains the frontend application for the Loan Management System (LMS). It is a modern, responsive web application built with Next.js and React, designed to provide a seamless user interface for borrowers and staff to interact with the loan application and management processes.

## Technology Stack
- **Framework:** Next.js
- **Library:** React
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **State Management & Data Fetching:** Context API, Axios
- **Animations:** Framer Motion
- **Notifications:** React Hot Toast

## Project Structure
The application follows a standard Next.js App Router architecture:
- `src/app/`: Contains all route components and page layouts.
- `src/components/`: Reusable UI components.
- `src/context/`: React context providers for global state management (e.g., AuthContext).
- `src/utils/`: Utility functions and API configuration.
- `public/`: Static assets such as images and icons.

## Prerequisites
Ensure you have the following installed on your local machine:
- Node.js (v20 or higher recommended)
- npm or yarn or pnpm

## Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

## Configuration
Create a `.env.local` file in the root of the frontend directory and configure the necessary environment variables. Example variables may include API base URLs:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application
To start the development server, run:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

## Scripts
- `npm run dev`: Starts the application in development mode.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality and styling issues.

## Guidelines
- Ensure strict typing with TypeScript to maintain codebase integrity.
- Follow the established component structure and reuse existing UI elements where applicable.
- Write descriptive commit messages following conventional commit standards.
