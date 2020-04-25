const serialport = require('serialport');
const Readline = require('@serialport/parser-readline');

const list = () => new Promise((resolve, reject) => {
  serialport.list().then((ports) => {
    resolve(
      ports.filter(({ pnpId }) => Boolean(pnpId))
    );
  }).catch((err) => {
    console.log(err);
    reject('Error occured with finding connected device on USB port.');
  });
});

const init = ({ path, baudRate = 9600, onPortOpened, onError }) => {
  const port = new serialport(path, { baudRate });

  const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

  console.log('Making connection', { path, baudRate });

  port.on('open', onPortOpened);

  port.on('error', onError);

  port.on('close', () => onError({ type: 'PORT_DISCONNECTED', message: `${path} port was closed.` }));
  
  const send = (data, newLine = false) => {
    const stringData = newLine ? `${data}\r\n` : data;

    console.log('Writing to serial', { newLine, stringData });

    port.write(stringData, (err) => {
      if (err) {
        onError({ message: `Failed to send to serial. ${err.message}` });
      }
    });
  };

  const subscribe = (onData) => [
    port.on('data', (data) => onData({
      line: data.toString('utf8'),
      newLine: false
    })),
    parser.on('data', (data) => onData({
      line: data.toString('utf8'),
      newLine: true
    }))
  ];

  const close = () => port.close();

  return { send, subscribe, close };
}

module.exports = { init, list };