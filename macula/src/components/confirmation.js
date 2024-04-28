// Confirmation.js
import React from 'react';
import "./Confirmation.css" ;
import OrangeButton from './OrangeButton';
import WhiteButton from './WhiteButton';
import { MdClose } from 'react-icons/md';

const Confirmation = ({ message, onCancel, onConfirm }) => {
 
  return (
    <div className="confirmMsg">
      <p className='confirm-inner'>{message}
      <div className="buttons-container">
      <button className='close-btn' onClick={onCancel}>
          <MdClose />
        </button>
        <OrangeButton className='confirm' text="Confirm" onClick={onConfirm}> </OrangeButton>
      </div></p>
      
    </div>
  );
};

export default Confirmation;
