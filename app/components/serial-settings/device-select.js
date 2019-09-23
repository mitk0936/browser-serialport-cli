import React from 'react';
import PropTypes from 'prop-types';

const useSelectPort = ({ ports = [] }) => {
  const [selectedPort, setSelectedPort] = React.useState(ports[0]);

  const portsNames = ports.map(({ comName }) => comName).join(' ');

  React.useEffect(() => setSelectedPort(ports[0]), [portsNames]);

  return { selectedPort, setSelectedPort };
};

export const DeviceSelect = ({
  ports = [],
  onConnect
}) => {
  const { selectedPort, setSelectedPort } = useSelectPort({ ports });

  return ports.length ? (
    <div>
      <label>
        Select device on port
      </label>
      <select onChange={(e) => setSelectedPort({ comName: e.target.value })}>
        {
          ports.map(({ comName }, index) => (
            <option
              key={`${comName}-${index}`}
              value={comName}
              selected={Boolean(
                selectedPort &&
                selectedPort.comName === comName
              )}
            >
              {comName}
            </option>
          ))
        }
      </select>
      {
        ports.length > 0 && (
          <button onClick={() => onConnect(selectedPort.comName)} icon="link" raised primary>
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