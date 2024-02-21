import React, { useState } from 'react';
import http from '../plugins/http';
import { useStore } from '../store/myStore';
import { useNavigate } from 'react-router';
import ActivationModal from './ActivationModal';

function LoginForm() {
  const { setUser } = useStore((state) => state);
  const [error, setError] = useState();
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [emailForActivation, setEmailForActivation] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.elements.email.value;
    const password1 = event.target.elements.password1.value;
    const loginCheckbox = event.target.elements.loginCheckbox.checked;
    const user = { email, password1 };

    try {
      const response = await http.post('login', user);

      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('autoLogin', loginCheckbox);
        setUser({
          email: response.data.email,
          username: response.data.username,
          imgURL: response.data.imgURL,
        });

        navigate('/forum');
      } else if (
        response.message ===
        'The user is not activated. Please enter the activation code.'
      ) {
        setEmailForActivation(email);

        setShowActivationModal(true);
      } else {
        setError(response.message || 'Login error. Please try again.');
      }
    } catch (error) {
      setError('Error! Please try again.');
    }
  };

  const handleActivation = async (code) => {
    try {
      const response = await http.post('verifyActivationCode', {
        email: emailForActivation,
        activationCode: code,
      });
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        setUser({ email: response.data.email });
        setShowActivationModal(false);
        navigate('/forum');
      } else {
        setError('Invalid activation code. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during activation. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className='login-form'>
        <div className='background-image' />
        <h2>Log In</h2>
        <input type='text' name='email' placeholder='E-mail address' />
        <input type='password' name='password1' placeholder='Password' />
        <div className='checkbox-container'>
          <input type='checkbox' name='loginCheckbox' className='auto-login' />
          <label htmlFor='auto-login'>Stay logged in</label>
        </div>
        <div className='error'>{error}</div>
        <button type='submit' className='primary-btn'>
          Log In
        </button>
        <p onClick={() => navigate('/restorePassword')} className='small-link'>
          Forgot your password?
        </p>
      </form>

      {showActivationModal && (
        <ActivationModal
          isOpen={showActivationModal}
          onClose={() => setShowActivationModal(false)}
          onActivate={handleActivation}
        />
      )}
    </div>
  );
}

export default LoginForm;
