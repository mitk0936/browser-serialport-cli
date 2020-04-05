import React from 'react';
import PropTypes from 'prop-types';

import Console from '../components/console';
import DeviceSelect from './serial-settings/device-select';
import BaudRateSelect from './serial-settings/baud-rate-select';

import { useDeviceWebsocket, useConsoleMessage } from './hooks';
import { printConsoleLog } from '../utils';

const Device = ({ id, socket, createNotification, onRemove }) => {
  const [connectedPort, setConnectedPort] = React.useState(null);
  const [lastMessage, setLastMessage] = React.useState(null);
  const [sendNewLine, setSendNewLine] = React.useState(false);
  const [newLineParser, setNewLineParser] = React.useState(false);
  const [selectedBaudRate, setNewBaudRate] = React.useState(null);

  const deviceConsole = React.useRef(null);

  const printLog = printConsoleLog({
    print: deviceConsole &&
      deviceConsole.current &&
      deviceConsole.current.print,
    onError: (e) => createNotification({ label: e.message })
  });

  const {
    ports,
    activeConnection,
    startConnection,
    sendMessage,
    closeConnection
  } = useDeviceWebsocket({
    socket,
    onMessage: ({ line, newLine, id }) =>
      setLastMessage({ line, newLine, id }),
    onError: ({ type, message }) => {
      if (type === 'PORT_DISCONNECTED') {
        onRemove();
      }

      printLog({ log: `Port Error: ${message}`, prefix: '<<<' })
      createNotification({ label: message });
    }
  });

  useConsoleMessage({
    lastMessage,
    newLineParser,
    onMessage: ({ message }) => printLog({ log: message })
  });

  return (
    <div className="device-container">
      {
        activeConnection && connectedPort && (
          <span>
            {`${connectedPort} baudrate: ${selectedBaudRate}`}
          </span>
        )
      }
      {
        !activeConnection && (
          <BaudRateSelect onChange={({ rate }) => setNewBaudRate(rate)} />
        )
      }
      {!activeConnection && (
        <DeviceSelect
          ports={ports}
          onConnect={(port) => {
            setConnectedPort(port);
            startConnection(port, selectedBaudRate);
          }}
        />
      )}
      {
        activeConnection && (
          <React.Fragment>
            <Console
              ref={deviceConsole}
              welcomeMessage={`Connected to: ${connectedPort}`}
              onCommand={(command) => sendMessage({ command, newLine: sendNewLine })}
            />
            <div>
              <label htmlFor={`${id}-new-line-parse`}>
                New line parser
              </label>
              <input id={`${id}-new-line-parse`} type="checkbox"
                checked={newLineParser}
                onChange={(e) => {
                  setNewLineParser(Boolean(e.target.checked));
                  printLog({
                    log: `New line parser: ${String(e.target.checked)}`,
                    prefix: ''
                  });
                }}
              />
              <span style={{ marginLeft: '10px' }}>
                <label htmlFor={`${id}-new-line-send`}>Send new line</label>
                <input id={`${id}-new-line-send`} type="checkbox"
                  checked={sendNewLine}
                  onChange={(e) => {
                    setSendNewLine(e.target.checked);
                    printLog({
                      log: `Send new line: ${String(e.target.checked)}`,
                      prefix: ''
                    });
                  }}
                />
              </span>
            </div>
          </React.Fragment>
        )
      }
      <div>
        <button onClick={onRemove}>
          Delete
        </button>
        {
          activeConnection && (
            <button onClick={() => closeConnection()}>
              Disconnect
            </button>
          )
        }
      </div>
    </div>
  );
};

Device.propTypes = {
  createNotification: PropTypes.func.isRequired,
  socket: PropTypes.any.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default Device;