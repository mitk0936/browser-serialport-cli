import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-toolbox/lib/dropdown';
import Button from 'react-toolbox/lib/button';

export const DeviceSelect = ({
  ports,
  onChangePort,
  selectedPort,
  onConnect
}) => {
  return ports.length ? (
    <div>
      <Dropdown
        style={{ border: '1px solid #ccc' }}
        floating
        auto
        onChange={onChangePort}
        source={ports}
        value={selectedPort}
        label="Select usb port"
        labelKey="comName"
        valueKey="comName"
      />
      {
        ports.length > 0 && (
          <Button onClick={onConnect} icon="link" raised primary>
            Connect
          </Button>
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