import React from 'react';
import PropTypes from 'prop-types';

const defaultSelectPort = ({ onChangePort, ports, selectedPort }, a) => {
  const [defaultPort, ...other] = ports;

  console.log('portshere2', a, ports);

  if (!selectedPort && defaultPort) {
    onChangePort(defaultPort.comName);
  }
};

export const DeviceSelect = ({
  ports = [],
  onChangePort,
  selectedPort,
  onConnect
}) => {

  React.useEffect(() => defaultSelectPort({ onChangePort, ports, selectedPort }, 'mount'), []);
  React.useEffect(() => defaultSelectPort({ onChangePort, ports, selectedPort }, 'update ports'), [ports.map(({comName}) => comName).join('')]);

  return ports.length ? (
    <div>
      <label>Select device on port</label>
      <select onChange={(e) => {
        onChangePort(e.currentTarget.value)
      }}>
        {
          ports.map(({comName}, index) => (
            <option key={`${comName}-${index}`}value={comName} selected={comName === selectedPort}>{comName}</option>
          ))
        }
      </select>
      {
        ports.length > 0 && (
          <button onClick={onConnect} icon="link" raised primary>
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
  selectedPort: PropTypes.string,
  onChangePort: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired
};

export default DeviceSelect;