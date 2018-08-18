import React from 'react';
import PropTypes from 'prop-types';
import styles from '../resources/css/App.css';
import { connect } from 'react-redux';
import Device from '../components/Device';

class App extends React.Component {
  render () {
    return (
      <div className={styles.app}>
        <Device />
      </div>
    );
  }
};

App.propTypes = {};

export default connect(function (state) {
  return { products: {} }
}, {})(App);
