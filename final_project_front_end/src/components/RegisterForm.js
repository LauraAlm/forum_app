import React, { useState } from 'react';
import http from '../plugins/http';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.elements.username.value;
    const email = event.target.elements.email.value;
    const password1 = event.target.elements.password1.value;
    const password2 = event.target.elements.password2.value;
    const role = event.target.elements.role.value;

    const user = { username, email, password1, password2, role };
    try {
      const response = await http.post('register', user);
      if (response.success) {
        setError(
          'You have successfully registered. Please check your email for the activation code.'
        );
        setSuccess(true);
      } else {
        setError(response.message);
        setSuccess(false);
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className='registration-form'>
      <div className='background-image' />
      <h2>Sign Up</h2>
      <input type='text' name='username' placeholder='Username' required />
      <input type='text' name='email' placeholder='E-mail address' required />
      <input type='password' name='password1' placeholder='Password' required />
      <input
        type='password'
        name='password2'
        placeholder='Verify password'
        required
      />
      <input
        type='text'
        name='role'
        placeholder='Your role: User / Admin'
        required
      />

      {error && <div className='error'>{error}</div>}
      {!success ? (
        <button type='submit' className='primary-btn'>
          Continue
        </button>
      ) : (
        <button onClick={() => navigate('/login')} className='primary-btn'>
          Log In
        </button>
      )}
    </form>
  );
}

export default RegisterForm;
