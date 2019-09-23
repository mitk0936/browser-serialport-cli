import React from 'react';
import PropTypes from 'prop-types';

export class Notifications extends React.Component {
  render() {
    const { notifications, onTimeout } = this.props;
    
    return (
      <React.Fragment>
        {
          notifications.map(({ id, label }) => (
            <div>{id} {label}</div>
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