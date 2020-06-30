import React from 'react';
import './toggleSwitch.css';

const ToggleSwitch = ({ isOn, handleToggle, onColor, id }) => {
  return (
    <div style={{ display: 'flex'}}>
      <label htmlFor={id} style={{ color: 'white', lineHeight: 1.5, fontSize: '1rem'}}>Mode indestructible:</label>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={id}
        type="checkbox"
        style={{ height: '10px'}}
      />
      <label
        style={{ background: isOn && onColor }}
        className="react-switch-label"
        htmlFor={id}
      >
        <span className={`react-switch-button`} />
      </label>
    </div>
  );
};

export default ToggleSwitch;
