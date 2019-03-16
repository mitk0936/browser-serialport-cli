import React from 'react';
import PropTypes from 'prop-types';
import Chip from 'react-toolbox/lib/chip';
import Avatar from 'react-toolbox/lib/avatar';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { FontIcon } from 'react-toolbox/lib/font_icon';
import Button from 'react-toolbox/lib/button';
import Checkbox from 'react-toolbox/lib/checkbox';
import Console from '../components/Console';
import DeviceSelect from './serial-settings/device-select';

export class Device extends React.Component {
  state = {
    ports: [],
    selectedPort: null,
    activeConnection: false,
    newLineParser: false,
    sendNewLine: false
  };

  console = null;

  constructor (props) {
    super(props);

    this.console = React.createRef();
  }
  
  startConnection = () => {
    const { socket, createNotification } = this.props;
    const { selectedPort } = this.state;

    if (selectedPort) {
      socket.emit('initSerialConnection', {
        comName: selectedPort
      });

      return;
    }

    createNotification({ label: 'No selected port.' });
  }

  abortConnection = (removeDevice = true) => {
    const { socket, onRemove } = this.props;
    const { selectedPort, activeConnection } = this.state;

    activeConnection && this.setState({ activeConnection: false });
    !removeDevice && socket.emit('closeSerialConnection');

    if (removeDevice) {
      socket.close();
      onRemove();
    }
  }

  sendCommand = (command) => {
    const { socket } = this.props;
    const { activeConnection } = this.state;

    if (activeConnection) {
      this.props.socket.emit('web->serial', {
        command,
        newLine: this.state.sendNewLine
      });
    }
  }

  saveLog = (log, prefix = '<<<') => {
    const { createNotification } = this.props;
    
    try {
      this.console.current.print(`${prefix} ${log}`);
    } catch (e) {
      createNotification({ label: `Error, ${e.message}` });
    }
  }

  componentWillMount () {
    const { socket, createNotification } = this.props;
    const { selectedPort, newLineParser } = this.state;

    socket.on('portslist', (ports = []) => this.setState({ ports }));

    socket.on('portError', ({ message }) => {
      this.saveLog(`Port Error: ${message}`, '<<<');
      createNotification({ label: message });
    });

    socket.on(
      'serialConnectionReady',
      ({ comName }) => {
        createNotification({ label: `${comName} port connected` })
        this.setState({ activeConnection: true });
      }
    );

    socket.on('serial->web', ({ line, newLine }) => {
      const { newLineParser } = this.state;
      if ((newLine && newLineParser) || (!newLine && !newLineParser)) {
        this.saveLog(line, '<<<');
      }
    });
  }

  render () {
    const { onRemove } = this.props;
    const { ports, activeConnection, newLineParser, sendNewLine, selectedPort } = this.state;

    return (
      <Card style={{
        marginBottom: '20px',
        marginRight: '10px',
        'flex': '0 0 330px',
        justifyContent: 'flex-start',
        position: 'relative',
        paddingBottom: '50px'
      }}>
        {
          activeConnection && selectedPort && (
            <CardActions>
              <Chip>
                <Avatar style={{backgroundColor: 'deepskyblue'}} icon="devices" />
                <span>
                  {selectedPort}
                </span>
              </Chip>
            </CardActions>
          )
        }
        {!activeConnection && (
          <CardActions>
            <React.Fragment>
              <DeviceSelect
                ports={ports}
                onChangePort={(port) => this.setState({ selectedPort: port })}
                selectedPort={selectedPort}
                onConnect={this.startConnection}
              />
            </React.Fragment>
          </CardActions>
        )}
        {
          activeConnection && (
            <React.Fragment>
              <Console
                ref={this.console}
                welcomeMessage={`Connected to: ${selectedPort}`}
                onCommand={this.sendCommand}
              />
              <CardActions>
                <Checkbox
                  floating
                  checked={newLineParser}
                  label="New line parser"
                  onChange={(value) => {
                    this.setState({ newLineParser: value });
                    this.saveLog(`New line parser: ${String(value)}`, '');
                  }}
                />
                <span style={{ marginLeft: '10px' }}>
                  <Checkbox
                    floating
                    checked={sendNewLine}
                    label="Send new line"
                    onChange={(value) => this.setState({ sendNewLine: value })}
                  />
                </span>
              </CardActions>
            </React.Fragment>
          )
        }
        <CardActions style={{
          backgroundColor: '#eee',
          borderTop: '1px solid #ccc',
          position: 'absolute',
          height: '50px',
          bottom: 0,
          left: 0,
          right: 0
        }}>
          <Button
            onClick={this.abortConnection}
            icon="delete"
            floating mini
          />
          {
            activeConnection && (
              <Button
                onClick={() => this.abortConnection(false)}
                icon="power_off"
                floating mini
              />
            )
          }
        </CardActions>
      </Card>
    );
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.close();
  }
};

Device.propTypes = {
  createNotification: PropTypes.func.isRequired,
  socket: PropTypes.any.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default Device;