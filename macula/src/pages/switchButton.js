import React from 'react';
import './switchbutton.css'; // Import the CSS file for styling

const switchButton = ({ activeSwitch, setActiveSwitch }) => {
  return (
    <div className="switch">
      <label className="switch-label">
        Attendance
        <input
          type="checkbox"
          checked={activeSwitch === 1}
          onChange={() => setActiveSwitch(activeSwitch === 1 ? 2 : 1)}
        />
        <span className="switch-slider"></span>
        Engagement
      </label>
    </div>
  );
};

export default switchButton;
