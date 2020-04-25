import React from 'react';
import PropTypes from 'prop-types';

import { useSelectOption } from '../hooks';

export const DeviceSelect = ({
  ports = [],
  onConnect
}) => {
  const selectPortOptions = useSelectOption({ options: ports, idKey: 'path' });
  const port = selectPortOptions.selectedOption;

  return ports.length ? (
    <div>
      <label>
        Select device on port
      </label>
      <select
        value={port && port.path}
        onChange={(e) => selectPortOptions.setSelectedOption({ path: e.target.value })}
      >
        {
          ports.map(({ path, pnpId }, index) => (
            <option key={`${path}-${index}`} value={path}>
              {pnpId}
            </option>
          ))
        }
      </select>
      {
        ports.length > 0 && (
          <button onClick={() => onConnect(port && port.path)}>
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
    path: PropTypes.string.isRequired
  })).isRequired,
  onConnect: PropTypes.func.isRequired
};

export default DeviceSelect;