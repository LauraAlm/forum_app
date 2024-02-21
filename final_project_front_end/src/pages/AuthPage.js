import React from 'react';
import { useNavigate } from 'react-router-dom';
import Toolbar from '../components/Toolbar';

function AuthPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div>
      <div className='auth-page'>
        <Toolbar />

        <div className='background-image' />

        <div className='welcome'>
          <h1>Welcome to Artiform!</h1>
          <h2>
            Unleash your creativity, share your art, and inspire others in our
            vibrant artist community.
          </h2>
        </div>
        <div className='login-register-btns-container'>
          <button onClick={handleLogin} className='primary-btn'>
            Log In
          </button>
          <button onClick={handleRegister} className='primary-btn'>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
