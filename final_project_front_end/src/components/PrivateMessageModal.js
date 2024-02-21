import React, { useState } from 'react';

function PrivateMessageModal({ isOpen, onClose, onSubmit, userId }) {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  return (
    <div className='modal-overlay modal-activation'>
      <div className='modal-content'>
        <h2>Your message:</h2>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Message text'
        />
        <div className='modal-buttons-div'>
          <button
            className='primary-btn'
            onClick={() => onSubmit(message, userId)}
          >
            Send
          </button>
          <button className='primary-btn' onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivateMessageModal;
