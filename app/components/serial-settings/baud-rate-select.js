import React from 'react';
import PropTypes from 'prop-types';

import { useSelectOption } from '../hooks';

const baudrates = [{ rate: 9600 }, { rate: 19200 }, { rate: 38400 }, { rate: 57600 }, { rate: 115200 }]

export const BaudRateSelect = ({ onChange }) => {
  const selectBaudOptions = useSelectOption({ options: baudrates, idKey: 'rate' });
  const baudrate = selectBaudOptions.selectedOption;

  React.useEffect(() => {
    onChange(baudrates[0])
  }, []);

  return (
    <div>
      <label>
        Select baudrate
      </label>
      <select
        value={baudrate && baudrate.rate}
        onChange={(e) => {
          selectBaudOptions.setSelectedOption({ rate: e.target.value });
          onChange({ rate: parseInt(e.target.value, 10) });
        }}
      >
        {
          baudrates.map(({ rate }, index) => (
            <option key={`${rate}-${index}`} value={rate}>
              {rate}
            </option>
          ))
        }
      </select>
    </div>
  );
};

BaudRateSelect.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default BaudRateSelect;