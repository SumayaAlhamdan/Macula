// Confirmation.js
import React from 'react';
import "./Confirmation.css" ;

const Confirmation = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="confirmMsg">
      <p className='confirm-inner'>{message}</p>
      <div className="buttons-container">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default Confirmation;
