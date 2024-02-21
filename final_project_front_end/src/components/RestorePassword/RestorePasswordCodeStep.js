import { useState } from 'react';
import http from '../../plugins/http';

export const RestorePasswordCodeStep = ({ next, formState, setFormState }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const code = event.target.elements.code.value;
    http
      .post('password-reset/code', { code, email: formState.email })
      .then((response) => {
        if (response?.message === 'success') {
          setFormState((prevState) => ({ ...prevState, code }));
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
      <h2>Reset your password</h2>
      <h4>Please check your email account.</h4>
      <input type='text' name='code' placeholder='Your code'></input>

      {errorMessage && <div>{errorMessage}</div>}
      <button type='submit' className='primary-btn'>
        Submit
      </button>
    </form>
  );
};
