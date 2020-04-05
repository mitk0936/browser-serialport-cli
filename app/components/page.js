import React from 'react';
import uuid from 'uuid/v4';
import io from 'socket.io-client';

import Device from './device';
import Notifications from './notifications';
import { omit } from '../utils';

import '../resources/css/App.css';

const App = () => {
  const [devices, setDevices] = React.useState({});
  const [notifications, setNotifications] = React.useState([]);

  return (
    <React.Fragment>
      <div>
        <div class="clearfix">
          {
            Object.keys(devices).map((id) => (
              <Device
                key={id}
                id={id}
                socket={devices[id].socket}
                createNotification={({ label }) => setNotifications(
                  (notifications) => [...notifications, { label, id: uuid() }]
                )}
                onRemove={() => setDevices(omit(id, devices))}
              />
            )
          )}
        </div>
        <button
          onClick={() => {

            setDevices({
              ...devices,
              [uuid()]: {
                socket: io('http://127.0.0.1:6543'),
                active: true
              }
            })
          }}
        >
          Add device
        </button>
      </div>
      <Notifications
        notifications={notifications}
        onTimeout={(notificationId) => {
          setNotifications((notifications) => notifications.filter(({ id }) => id !== notificationId))
        }}
      />
    </React.Fragment>
  );
};

export default App;