import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from 'react-toolbox';

export class Notifications extends React.Component {
  render() {
    const { notifications, onTimeout } = this.props;
    
    return (
      <React.Fragment>
        {
          notifications.map(({ id, label }) => (
            <Snackbar
              action='Dismiss'
              active={true}
              label={label}
              timeout={5000}
              onClick={() => onTimeout(id)}
              onTimeout={() => onTimeout(id)}
              type='cancel'
            />
          ))
        } 
      </React.Fragment>
    );
  }
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf({
    id: PropTypes.string.isRequired
  }),
  onTimeout: PropTypes.func.isRequired
};

Notifications.defaultProps = {
  notifications: []
};

export default Notifications;