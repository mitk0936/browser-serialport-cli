import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'react-toolbox/lib/checkbox';
import Button from 'react-toolbox/lib/button';

export const ConsoleOptions = ({
  sendNewLine,
  onChangeNewLine
}) => {
  return (
    <React.Fragment>
      <Checkbox
        floating
        checked={sendNewLine}
        label="Send new line"
        onChange={onChangeNewLine}
      />
    </React.Fragment>
  );
};

ConsoleOptions.propTypes = {
  sendNewLine: PropTypes.bool.isRequired,
  onChangeNewLine: PropTypes.func.isRequired,
  onClearLogs: PropTypes.func.isRequired
};

export default ConsoleOptions;