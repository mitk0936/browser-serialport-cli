const express = require('express');
const port = process.env.PORT || 6543;
const app = express();
const server = require('http').createServer(app);
const client = require('./client');

client.run(server);

/* Webpack middleware */
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
const compiler = webpack(config);
const middleware = webpackMiddleware(
  compiler,
  require('./config.compile.options')
    (config.output.publicPath)
);

app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get('/', function response(req, res) {
  res.write(
    middleware.fileSystem.readFileSync(
      require('path')
        .join(__dirname, 'dist/index.html')
    )
  );
  res.end();
});

server.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});