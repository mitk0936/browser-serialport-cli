import React from 'react';
import PropTypes from 'prop-types';
import commonStyles from '../resources/css/App.css';

export class Console extends React.Component {
  render() {
    return [
      (
        <ul key="logs" className={commonStyles.ul}>
          {
            Object.keys(this.props.logs).map((key) => (
              <li key={`command-${key}-${key}`}>
                {this.props.logs[key]}
              </li>
            ))
          }
        </ul>
      ),
      (
        <input
          type="text"
          className={commonStyles.input}
          key="command" onKeyPress={
            (ev) => {
              if (ev.key === 'Enter') {
                this.props.onCommand(ev.target.value)
              }
            }
          }
        />
      )
    ];  
  }
};

Console.propTypes = {
  logs: PropTypes.object.isRequired,
  onCommand: PropTypes.func.isRequired
}

export default Console;