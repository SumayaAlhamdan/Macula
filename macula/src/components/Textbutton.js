import React from 'react';
import PropTypes from 'prop-types';

const Textbutton = ({ className, onClick, children }) => {
  return (
    <button
      className={className}
      onClick={onClick}
      style={{
        border: 'none',
        background: 'none',
        padding: '0',
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
      }}
    >
      {children}
    </button>
  );
};

Textbutton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Textbutton;
