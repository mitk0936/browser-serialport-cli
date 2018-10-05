const serialport = require('serialport');
const Readline = require('@serialport/parser-readline');

const list = () => new Promise((resolve, reject) => {
  serialport.list((err, ports) => {
    if (err) {
      reject('Error occured with finding connected device on USB port.');
    }

    resolve(
      ports.filter(
        ({ serialNumber, manufacturer }) => 
          Boolean(serialNumber || manufacturer)
      )
    );
  });
});

const init = (comName, onError) => {
  const port = new serialport(comName, {
    baudRate: 9600
  });

  const parser = port.pipe(new Readline({ delimiter: '\n' }));

  port.on('error', onError);

  port.on('close', () => onError({
    message: 'Error: Serial port was closed.'
  }));
  
  const send = (data, newLine = false) => {
    const stringData = newLine ? `${data}\r\n` : data;

    port.write(data, (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
    });
  };

  const subscribe = (onData) => {
    parser.on('data', function (data) {
      const stringData = data.toString('utf8');
      onData(stringData);
    });

    port.on('data', (data) => onData(data.toString('utf8')));
  };

  const close = () => port.close();

  return { send, subscribe, close };
}

module.exports = { init, list };