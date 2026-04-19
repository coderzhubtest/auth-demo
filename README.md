# User Authentication App

A full-stack User Authentication Application built with Python FastAPI, React, and JSON database.

## Features

✅ User Registration & Login  
✅ JWT-based Authentication  
✅ Profile Management  
✅ Password Change  
✅ Protected Routes  
✅ Modern UI with React  
✅ FastAPI RESTful API  
✅ JSON File-based Database  
✅ CORS Support  
✅ Email Validation  

## Tech Stack

- **Backend**: Python FastAPI
- **Frontend**: React with React Router
- **Database**: JSON files
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt for password hashing

## Project Structure

```
.
├── backend/
│   ├── main.py           # FastAPI application
│   ├── models.py         # Pydantic models
│   ├── database.py       # JSON database handler
│   ├── auth.py           # Authentication logic
│   ├── config.py         # Configuration settings
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service
│   │   └── App.js        # Main app component
│   ├── public/           # Static files
│   └── package.json      # Node dependencies
├── data/
│   └── users.json        # User database
└── .github/
    └── copilot-instructions.md
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/users/{user_id}` | Get user profile |
| PUT | `/api/users/{user_id}` | Update user profile |
| POST | `/api/auth/change-password` | Change password |
| GET | `/health` | Health check |

## Usage Examples

### Register a User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:8000/api/users/{user_id} \
  -H "Authorization: Bearer {access_token}"
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

### Backend (config.py)
```python
SECRET_KEY="your-secret-key-change-this-in-production"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Security Notes

⚠️ **Important**: This is a demonstration application. For production use:
- Change the `SECRET_KEY` in `config.py`
- Use proper environment variables
- Add additional validation and error handling
- Implement rate limiting
- Use HTTPS
- Consider using a proper database instead of JSON

## Development

### Running Tests

Backend:
```bash
cd backend
pytest
```

### Troubleshooting

**CORS Error**: Make sure both frontend and backend are running on the correct ports (3000 and 8000).

**Port Already in Use**: 
- Backend: `lsof -i :8000` (macOS/Linux) or `netstat -ano | findstr :8000` (Windows)
- Frontend: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)

## License

This project is open source and available under the MIT License.
