const socketIo = require('socket.io');
const serial = require('./serial');

const initSerialConnection = ({ client, path, baudRate, onDisconnect }) => {
  if (!path) {
    client.emit('portError', { message: `Connection cannot be established to ${path}` });
    return;
  }

  const { send, subscribe, close } =
    serial.init({
      path,
      baudRate,
      onPortOpened: () => client.emit('serialConnectionReady', { path }),
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
    
    client.on('initSerialConnection', ({ path, baudRate }) => initSerialConnection({
      client,
      path,
      baudRate,
      onDisconnect: () => clearInterval(portsUpdate)
    }));
  });
};

module.exports = { run };