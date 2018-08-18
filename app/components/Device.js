import React from 'react';
import PropTypes from 'prop-types';
import styles from '../resources/css/Device.css';
import commonStyles from '../resources/css/App.css';
import Console from '../components/Console';
import io from 'socket.io-client';

export class Device extends React.Component {
  state = {
    logs: {},
    ports: [],
    selectedPort: null,
    sendNewLine: false
  };

  socket = null;
  
  componentWillMount () {
    this.socket = io('http://127.0.0.1:6543');

    this.socket.on('portslist', (ports) => this.setState({ ports }));
    this.socket.on('portError', (errMessage) => alert(errMessage));

    this.socket.on('serial->web', (line) => {
      this.onCommand(line, '<<<');
    });
  }

  renderPortSelect = () => {
    const { ports } = this.state;

    return ports.length ? (
      <select
        className={commonStyles.input}
        onChange={(e) => this.setState({
          selectedPort: e.target.value
        })}
      >
        {
          ports.map(({ comName }) => (
            <option value={comName} key={`port-device-${comName}`}>
              {comName}
            </option>
          ))
        }
      </select>
    ) : (
      <p>
        No connected devices
      </p>
    );
  }

  renderConsoleFooter = () => {
    return (
      <div>
        <input
          type="checkbox"
          id="send-new-line"
          name="send-new-line"
          checked={this.state.sendNewLine}
          onChange={(ev) => this.setState({ sendNewLine: ev.target.checked })}
        />
        <label for="send-new-line">
          Send New Line
        </label>
      </div>
    );
  }

  render () {
    return (
      <fieldset className={styles['device-container']}>
        <legend>
          New USB Device
        </legend>
        {this.renderPortSelect()}

        <button
          className={commonStyles.input}
          onClick={() => this.startConnection()}
        >
          Connect
        </button>

        <Console
          logs={this.state.logs}
          ref={(ref) => this.console = ref}
          onCommand={this.onCommand}
        />

        {this.renderConsoleFooter()}
      </fieldset>
    );
  }

  startConnection = () => {
    if (this.state.selectedPort || this.state.ports.length > 0) {
      const comName = this.state.selectedPort || this.state.ports[0].comName;
      this.socket.emit('initSerialConnection', { comName });
    }
  }

  onCommand = (command, prefix = '>>>') => {
    this.socket.emit('web->serial', {
      command,
      newLine: this.state.sendNewLine
    });

    this.setState({
      logs: {
        ...this.state.logs,
        [`${+new Date()}-command-${command}`]: `${prefix} ${command}`
      }
    });
  }

};

Device.propTypes = {};

export default Device;