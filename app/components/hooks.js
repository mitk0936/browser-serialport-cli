import React from 'react';
import uuid from 'uuid/v4';

export const useDeviceWebsocket = ({ socket, onMessage, onError }) => {
  const [ports, setPorts] = React.useState([]);
  const [activeConnection, setActiveConnection] = React.useState(false);

  React.useEffect(() => {
    socket.on('portslist', (ports = []) => setPorts(ports));

    socket.on('portError', ({ type, message }) => onError({ type, message }));

    socket.on('serialConnectionReady', ({ path }) => setActiveConnection(true));

    socket.on('serial->web', ({ line, newLine }) => onMessage({ line, newLine, id: `message-${uuid()}` }));

    return () => socket.close();
  }, []);

  return {
    ports,
    activeConnection,
    startConnection: (port = null, baudRate = 9600) => socket.emit('initSerialConnection', { path: port, baudRate }),
    sendMessage: ({ command, newLine }) => socket.emit('web->serial', { command, newLine }),
    closeConnection: () => [socket.emit('closeSerialConnection'), setActiveConnection(false)]
  };
};

export const useConsoleMessage = ({ lastMessage, newLineParser, onMessage }) => {
  React.useEffect(() => {
    if (lastMessage) {
      const { id, line, newLine } = lastMessage;
      
      const shouldPrintLine = Boolean(
        Boolean(newLineParser && newLine) ||
        Boolean(!newLineParser && !newLine)
      );

      if (shouldPrintLine) {
        onMessage({ message: line });
      }
    }
  }, [lastMessage && lastMessage.id]);
};

export const useSelectOption = ({ options = [], idKey }) => {
  const [selectedOption, setSelectedOption] = React.useState(options[0]);

  const optionsNames = options.map((option) => option[idKey]).join(' ');

  React.useEffect(() => setSelectedOption(options[0]), [optionsNames]);

  return { selectedOption, setSelectedOption };
};