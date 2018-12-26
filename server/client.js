const socketIo = require('socket.io');
const serial = require('./serial');

const run = (server) => {
  const io = socketIo(server);

  const emitPorts = (client = io.sockets) =>
    serial
      .list()
      .then((ports) => client.emit('portslist', ports));

  io.on('connection', (client) => {
    const portsUpdate = setInterval(() => emitPorts(), 10000);
    emitPorts(client);
    
    client.on('initSerialConnection', ({ comName, newLineParser = false }) => {
      const { send, subscribe, close } =
        serial.init(
          comName,
          () => client.emit('serialConnectionReady', { comName }),
          ({ message }) => client.emit('portError', { message })
        );

      subscribe({ newLineParser }, (line) => client.emit('serial->web', line));

      client.on('web->serial', ({ command, newLine }) => send(command, newLine));

      client.once('closeSerialConnection', () => close());

      client.once('disconnect', () => {
        console.log('DISCONNECTED');
        close();
        client.removeAllListeners('web->serial');
        clearInterval(portsUpdate);
      });
    });
  });
};

module.exports = { run };