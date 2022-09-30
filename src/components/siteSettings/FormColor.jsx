import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

const FormColor = ({ name, value, onChange }) => {
  const [color, setColor] = useState(value);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    setColor(color.hex);
    const valueObject = {};
    valueObject[name] = color.hex;
    onChange(valueObject);
    setDisplayColorPicker(false);
  };

  const styles = {
    color: {
      width: '36px',
      height: '36px',
      borderRadius: '1px',
      background: `${color}`,
    },
    swatch: {
      padding: '5px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    },
    popover: {
      position: 'absolute',
      zIndex: '2',
      right: '50px',
      top: '-36px',
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };
  return (
    <div className="position-relative">
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default FormColor;
