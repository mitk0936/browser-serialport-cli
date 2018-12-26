import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-toolbox/lib/dropdown';
import Checkbox from 'react-toolbox/lib/checkbox';
import Button from 'react-toolbox/lib/button';

export const DeviceSelect = ({
  ports,
  onChangePort,
  selectedPort,
  newLineParser = false,
  onChangeNewLineParser,
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
      <Checkbox
        floating
        checked={newLineParser}
        label="New line parser"
        onChange={onChangeNewLineParser}
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
  newLineParser: PropTypes.boolean,
  onChangeNewLineParser: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired
};

export default DeviceSelect;