import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App.js';
import { Provider } from 'react-redux';
import { store } from './store.js';

ReactDOM.render((
  <Provider store={ store }>
    <App />
  </Provider>
), document.getElementById('root'));
