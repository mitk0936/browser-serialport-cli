const socketIo = require('socket.io');
const serial = require('./serial');

const initSerialConnection = ({ client, comName, baudRate, onDisconnect }) => {
  if (!comName) {
    client.emit('portError', { message: `Connection cannot be established to ${comName}` });
    return;
  }

  const { send, subscribe, close } =
    serial.init({
      comName,
      baudRate,
      onPortOpened: () => client.emit('serialConnectionReady', { comName }),
      onError: ({ type, message }) => client.emit('portError', { type, message })
    });

  subscribe(({ line, newLine }) => client.emit('serial->web', { line, newLine }));

  client.on('web->serial', ({ command, newLine }) => send(command, newLine));

  client.once('closeSerialConnection', () => close());

  client.once('disconnect', () => {
    console.log('Client disconnected.');
    close();
    client.removeAllListeners('web->serial');
    onDisconnect();
  });
};

const run = (server) => {
  const io = socketIo(server);

  const emitPorts = (client = io.sockets) =>
    serial
      .list()
      .then((ports) => client.emit('portslist', ports));

  io.on('connection', (client) => {
    const portsUpdate = setInterval(() => emitPorts(), 10000);
    emitPorts(client);
    
    client.on('initSerialConnection', ({ comName, baudRate }) => initSerialConnection({
      client,
      comName,
      baudRate,
      onDisconnect: () => clearInterval(portsUpdate)
    }));
  });
};

module.exports = { run };