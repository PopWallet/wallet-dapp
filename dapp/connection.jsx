import React         from 'react'
import { connect }   from 'react-redux'
import { rpc }       from 'lib/rpc_calls'
import { Bouncing }  from '@poplocker/react-ui'

class Connection extends React.Component {
  componentDidMount() {
    this.props.dispatch(rpc.getAddress());
    this.props.dispatch(rpc.isListening());
    this.timer = setInterval(() => this.updatePoll(), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  loadOrError () {
    if (this.props.connection == -1) {
      return (
        <Bouncing/>
      )
    }
    if (!this.props.connection)
      return (
        <p>
          No connection!
        </p>
      )
    else if (this.props.address.length > 0)
      return this.props.children;
    else return (
      <p>
        No Address!
      </p>
    )
  }

  // TODO: move to wallet.jsx
  updatePoll() {
    this.props.dispatch(rpc.isListening());
    this.props.dispatch(rpc.getAddress());
    this.props.dispatch(rpc.getBalance());
  }

  render () {
    return (
      <div className="connection">
        { this.loadOrError() }
      </div>
    )
  }
}

export default connect(({ address, connection }) => ({ address, connection }))(Connection);
