import React from 'react';
import PropTypes from 'prop-types';
import ReactConsole from 'react-console-component';
require('react-console-component/lib/react-console.css');

export class Console extends React.Component {
  console = null;

  constructor(props) {
    super(props);
    this.console = React.createRef();
  }

  print = (message) => this.echo(message, false);

  echo = (message, notify = true) => {
    const { onCommand } = this.props;
    
    notify ? onCommand(message) : this.console.current.log(message);

    this.console.current.return();
  }

  render() {
    const { welcomeMessage } = this.props;

    return (
      <div style={{ border: '1px solid #ccc', borderLeft: 0, borderRight: 0 }}>
        <ReactConsole
          welcomeMessage={welcomeMessage}
          ref={this.console}
          handler={this.echo}
          autofocus={true}
        />
      </div>
    );
  }
};

Console.propTypes = {
  welcomeMessage: PropTypes.string,
  onCommand: PropTypes.func.isRequired
};

export default Console;