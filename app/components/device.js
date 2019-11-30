import React from 'react';
import PropTypes from 'prop-types';

import Console from '../components/console';
import DeviceSelect from './serial-settings/device-select';

import { useDeviceWebsocket, useConsoleMessage, printConsoleLog } from './utils';

const Device = ({ socket, createNotification, onRemove }) => {
  const [connectedPort, setConnectedPort] = React.useState(null);
  const [lastMessage, setLastMessage] = React.useState(null);
  const [sendNewLine, setSendNewLine] = React.useState(false);
  const [newLineParser, setNewLineParser] = React.useState(false);

  const deviceConsole = React.useRef(null);

  const consolePrint = deviceConsole && deviceConsole.current && deviceConsole.current.print;

  const printLog = printConsoleLog({
    print: consolePrint,
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
    onMessage: ({ line, newLine, id }) => setLastMessage({ line, newLine, id }),
    onError: ({ message }) => {
      if (consolePrint) {
        printLog({ log: `Port Error: ${message}`, prefix: '<<<' });
      }

      createNotification({ label: message });
    }
  });

  useConsoleMessage({
    lastMessage,
    newLineParser,
    onMessage: ({ message }) => printLog({ log: message })
  });

  return (
    <div>
      {
        activeConnection && connectedPort && (
          <span>
            {connectedPort}
          </span>
        )
      }
      {!activeConnection && (
        <div>
          <DeviceSelect
            ports={ports}
            onConnect={(port) => {
              setConnectedPort(port);
              startConnection(port);
            }}
          />
        </div>
      )}
      {
        activeConnection && (
          <React.Fragment>
            <Console
              ref={deviceConsole}
              welcomeMessage={`Connected to: ${connectedPort}`}
              onCommand={(command) => sendMessage({ command })}
            />
            <div>
              <label htmlFor="new-line-parse">
                New line parser
              </label>
              <input id="new-line-parse" type="checkbox"
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
                <label htmlFor="new-line-send">Send new line</label>
                <input id="new-line-send" type="checkbox"
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