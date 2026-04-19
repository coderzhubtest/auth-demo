import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Authentication App</h1>
        <p>A secure User Authentication & Profile Management System</p>
        
        {currentUser ? (
          <div className="home-actions">
            <button className="btn primary" onClick={() => navigate('/profile')}>
              Go to Profile
            </button>
            <button
              className="btn secondary"
              onClick={() => {
                authService.logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="home-actions">
            <button className="btn primary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn secondary" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
