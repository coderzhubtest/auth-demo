# Backend Branch

This branch contains only the **FastAPI backend** code for the User Authentication Application.

## Overview
The backend is a FastAPI server that handles:
- User registration and login
- JWT-based authentication
- Protected API endpoints
- User profile management
- JSON-based persistent storage

## Structure
```
backend/
├── main.py          # FastAPI application entry point
├── auth.py          # Authentication logic (JWT, login/register)
├── models.py        # Data models and schemas
├── database.py      # Database operations
├── config.py        # Configuration settings
└── requirements.txt # Python dependencies
```

## Setup & Running

### Prerequisites
- Python 3.8+
- pip

### Installation
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Start the Server
```bash
python main.py
```

The server will run on **http://localhost:8000**

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Key Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user and get JWT token
- `GET /api/users/{user_id}` - Get user profile (requires auth)
- `PUT /api/users/{user_id}` - Update user profile (requires auth)
- `POST /api/auth/logout` - Logout user

## Environment Variables
Create a `.env` file in the `backend/` directory:
```
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Database
User data is stored in `../data/users.json` (JSON file-based storage)

---

**For the complete full-stack application, check the [main branch](https://github.com/coderzhubtest/auth-demo)**
