import { useState } from 'react';
import http from '../../plugins/http';

export const RestorePasswordEmailStep = ({ next, setFormState }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    http
      .post('password-reset/email', { email })

      .then((response) => {
        if (response?.message === 'success') {
          setFormState((prevState) => ({ ...prevState, email }));
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
      <input type='text' name='email' placeholder='E-mail address'></input>
      {errorMessage && <div>{errorMessage}</div>}
      <button type='submit' className='primary-btn'>
        Submit
      </button>
    </form>
  );
};
