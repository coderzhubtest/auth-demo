# User Authentication App - Development Guide

This is a full-stack User Authentication Application with:
- **Backend**: Python FastAPI with JWT authentication
- **Frontend**: React with modern UI
- **Database**: JSON file-based persistence

## Project Structure

- `backend/` - FastAPI server with authentication endpoints
- `frontend/` - React application with auth pages
- `data/` - JSON database files (users.json)

## Setup Instructions

### Backend Setup
1. Navigate to backend folder: `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `python main.py` (runs on http://localhost:8000)

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm start` (runs on http://localhost:3000)

## Key Features

- User Registration with email validation
- JWT-based login and session management
- Protected API endpoints
- User profile management
- JSON-based persistent storage
- CORS enabled for frontend-backend communication

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/{user_id}` - Get user profile
- `PUT /api/users/{user_id}` - Update user profile
- `POST /api/auth/logout` - Logout user
