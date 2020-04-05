import React from 'react';
import PropTypes from 'prop-types';

import { useSelectOption } from '../hooks';

export const DeviceSelect = ({
  ports = [],
  onConnect
}) => {
  const selectPortOptions = useSelectOption({ options: ports, idKey: 'comName' });
  const port = selectPortOptions.selectedOption;

  return ports.length ? (
    <div>
      <label>
        Select device on port
      </label>
      <select
        value={port && port.comName}
        onChange={(e) => selectPortOptions.setSelectedOption({ comName: e.target.value })}
      >
        {
          ports.map(({ comName }, index) => (
            <option key={`${comName}-${index}`} value={comName}>
              {comName}
            </option>
          ))
        }
      </select>
      {
        ports.length > 0 && (
          <button onClick={() => onConnect(port && port.comName)}>
            Connect
          </button>
        )
      }
    </div>
  ) : (
    <p>
      No connected devices
    </p>
  );
};

DeviceSelect.propTypes = {
  ports: PropTypes.arrayOf(PropTypes.shape({
    comName: PropTypes.string.isRequired
  })).isRequired,
  onConnect: PropTypes.func.isRequired
};

export default DeviceSelect;