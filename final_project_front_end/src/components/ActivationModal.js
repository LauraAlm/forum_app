import React, { useState } from 'react';

function ActivationModal({ isOpen, onClose, onActivate }) {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  return (
    <div className='modal-overlay modal-activation'>
      <div className='modal-content'>
        <h2>Enter validation code</h2>
        <input
          type='text'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder='Validation code'
        />
        <div className='modal-buttons-div'>
          <button className='primary-btn' onClick={() => onActivate(code)}>
            Submit
          </button>
          <button className='primary-btn' onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivationModal;
