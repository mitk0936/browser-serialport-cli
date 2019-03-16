import React from 'react';
import uuid from 'uuid/v4';
import io from 'socket.io-client';
import { Layout, Panel, Button } from 'react-toolbox/lib';
import Device from './Device';
import Notifications from './Notifications';
import commonStyles from '../resources/css/App.css';

export class App extends React.Component {
  state = {
    devices: {},
    notifications: []
  };

  addDevice = () =>
    this.setState({
      devices: {
        ...this.state.devices,
        [uuid()]: {
          socket: io('http://127.0.0.1:6543'),
          active: true
        }
      }
    });

  removeDevice = (deviceId) =>
    this.setState({
      devices: {
        ...this.state.devices,
        [deviceId]: {
          ...this.state.devices[deviceId],
          active: false
        }
      }
    });

  addNotification = ({ label }) =>
    this.setState({
      notifications: [
        ...this.state.notifications,
        {
          id: uuid(),
          label
        }
      ]
    });

  removeNotification = (notificationId) =>
    this.setState({
      notifications: this.state.notifications.filter(({ id }) => id !== notificationId)
    });

  render() {
    const { devices, notifications } = this.state;

    return (
      <Layout style={{ backgroundColor: '#ccc' }}>
        <Panel style={{ padding: '20px' }}>
          <div style={{ display: 'flex' }}>
            {
              Object.keys(devices).map((id) => devices[id].active ? (
                <Device
                  key={id}
                  socket={devices[id].socket}
                  createNotification={this.addNotification}
                  onRemove={() => this.removeDevice(id)}
                />
              ) : null
            )}
          </div>
          <Button icon='add' label='Add device' flat primary onClick={this.addDevice} raised />
        </Panel>
        <Notifications
          notifications={notifications}
          onTimeout={this.removeNotification}
        />
      </Layout>
    );
  }
}

export default App;