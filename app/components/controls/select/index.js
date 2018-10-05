import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './select.css';

export const Select = ({
  name,
  onChange = () => null,
  options = [],
  optionLabelKey,
  optionValueKey
}) => {
  return (
    <select
      className={styles.select}
      onChange={(e) => onChange(e.target.value)}
    >
      {
        options.map((data) => (
          <option
            key={`select-${data[optionValueKey]}`}
            value={data[optionValueKey]}
          >
            {data[optionLabelKey]}
          </option>
        ))
      }
    </select>
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  optionLabelKey: PropTypes.string.isRequired,
  optionValueKey: PropTypes.string.isRequired
};

export default Select;