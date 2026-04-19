# Frontend Branch

This branch contains only the **React frontend** code for the User Authentication Application.

## Overview
The frontend is a React application that provides:
- User registration page
- User login page
- Protected dashboard/home page
- User profile management
- JWT token-based authentication
- Responsive UI with CSS styling

## Structure
```
frontend/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── index.js               # React entry point
│   ├── App.js                 # Main App component
│   ├── App.css                # Global styles
│   ├── components/
│   │   ├── Auth.css           # Auth component styles
│   │   ├── Home.js            # Home/Dashboard component
│   │   ├── Home.css           # Home component styles
│   │   ├── Login.js           # Login form component
│   │   ├── Register.js        # Registration form component
│   │   ├── Profile.js         # User profile component
│   │   ├── Profile.css        # Profile component styles
│   │   └── PrivateRoute.js    # Protected route wrapper
│   └── services/
│       └── authService.js     # API communication & auth logic
├── package.json               # Dependencies and scripts
└── package-lock.json          # Locked dependency versions
```

## Setup & Running

### Prerequisites
- Node.js 14+ and npm
- Ensure the backend server is running (http://localhost:8000)

### Installation
```bash
cd frontend
npm install
```

### Start Development Server
```bash
npm start
```

The application will open at **http://localhost:3000**

### Build for Production
```bash
npm run build
```

Builds the app for production to the `build` folder.

## Features
- **Registration**: Create a new account with email validation
- **Login**: Authenticate and receive JWT token
- **Protected Routes**: Only authenticated users can access certain pages
- **Profile Management**: View and update user information
- **Session Management**: Secure token storage and automatic logout

## Authentication Flow
1. User registers with email and password
2. User logs in and receives JWT token
3. Token is stored securely (typically in httpOnly cookie or secure storage)
4. All API requests include the token in the Authorization header
5. Protected pages check token validity and redirect to login if expired

## API Integration
The frontend communicates with the backend API at `http://localhost:8000`

Key endpoints used:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/users/{user_id}` - Fetch user profile
- `PUT /api/users/{user_id}` - Update user profile
- `POST /api/auth/logout` - Logout user

## Environment Configuration
Create a `.env.local` file in the frontend directory for environment-specific settings:
```
REACT_APP_API_URL=http://localhost:8000
```

---

**For the complete full-stack application, check the [main branch](https://github.com/coderzhubtest/auth-demo)**
