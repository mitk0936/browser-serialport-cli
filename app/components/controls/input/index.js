import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './input.css';

export const Input = ({ name, onEnter = () => null }) => {
  return (
    <input
      className={styles.input}
      type="text"
      onKeyPress={
        (ev) => {
          if (ev.key === 'Enter') {
            onEnter(ev.target.value)
          }
        }
      }
    />
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  onEnter: PropTypes.func
};

export default Input;