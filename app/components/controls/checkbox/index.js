import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './checkbox.css';

export const Checkbox = ({ name, label, onChange, checked }) => {
  return (
    <div>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={(ev) => onChange(ev.target.checked)}
      />
      <label for={name}>
        {label}
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Checkbox;