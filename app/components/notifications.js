import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ id, label, onTimeout }) => {
  React.useEffect(() => {
    setTimeout(onTimeout, 10000);
  }, []);

  return (
    <div>{id} {label}</div>
  );
};

export const Notifications = ({ notifications = [], onTimeout }) => {
  return (
    <React.Fragment>
      {notifications.map((notification) =>
        <Notification
          key={notification.id}
          id={notification.id}
          label={notification.label}
          onTimeout={() => onTimeout(notification.id)}
        />
      )} 
    </React.Fragment>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })),
  onTimeout: PropTypes.func.isRequired
};

Notifications.defaultProps = {
  notifications: []
};

export default Notifications;