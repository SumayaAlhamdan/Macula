import React, { useEffect } from 'react';
import "./Success.css";

function Success({ trigger, setTrigger, text }) {
  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => {
        setTrigger(false); // Hide the success message after 5 seconds
      }, 4000);

      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [trigger, setTrigger]);

  return trigger ? (
    <div className='successMsg'>
      <div className='success-inner'>
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
        <span>{text}</span>
      </div>
    </div>
  ) : null;
}

export default Success;
