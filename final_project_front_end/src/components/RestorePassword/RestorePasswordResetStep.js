import { useState } from 'react';
import http from '../../plugins/http';

export const RestorePasswordResetStep = ({ next, formState }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const password1 = event.target.elements.password1.value;
    const password2 = event.target.elements.password2.value;
    http
      .post('password-reset/password', {
        password1,
        password2,
        code: formState.code,
        email: formState.email,
      })

      .then((response) => {
        if (response?.message === 'success') {
          next();
        } else {
          setErrorMessage(response?.message);
        }
      })
      .catch((error) => {
        setErrorMessage('error');
      });
  };

  return (
    <form onSubmit={handleSubmit} className='registration-form'>
      <h2>Reset password</h2>
      <h4>Your new password</h4>
      <input type='password' name='password1' placeholder='Password'></input>
      <input
        type='password'
        name='password2'
        placeholder='Verify password'
      ></input>
      {errorMessage && <div>{errorMessage}</div>}
      <button type='submit' className='primary-btn'>
        Submit
      </button>
    </form>
  );
};
