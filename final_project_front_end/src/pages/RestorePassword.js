import { useState } from 'react';
import { RestorePasswordCodeStep } from '../components/RestorePassword/RestorePasswordCodeStep';
import { RestorePasswordEmailStep } from '../components/RestorePassword/RestorePasswordEmailStep';
import { RestorePasswordResetStep } from '../components/RestorePassword/RestorePasswordResetStep';
import { useNavigate } from 'react-router-dom';

export const Restore = () => {
  const [currentStep, setCurrentStep] = useState('email');

  const [formState, setFormState] = useState({
    email: null,
    code: null,
    password1: null,
    password2: null,
  });

  const navigate = useNavigate();

  return (
    <div className='login-page'>
      <div className='background-image' />
      {currentStep === 'email' && (
        <RestorePasswordEmailStep
          next={() => setCurrentStep('code')}
          setFormState={setFormState}
        />
      )}
      {currentStep === 'code' && (
        <RestorePasswordCodeStep
          next={() => setCurrentStep('reset')}
          formState={formState}
          setFormState={setFormState}
        />
      )}
      {currentStep === 'reset' && (
        <RestorePasswordResetStep
          next={() => navigate('/login')}
          formState={formState}
        />
      )}
    </div>
  );
};
