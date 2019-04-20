import React                   from 'react'
import { connect }             from 'react-redux'
import { bindActionCreators }  from 'redux'
import { Button, Input }       from '@poplocker/react-ui'
import { SmartLockerContract } from 'lib/contracts'
import { rpc }                 from 'lib/rpc_calls'
import { addPendingTx }        from 'lib/store/actions'

import './management.css'

class ManagementSubview extends React.Component {
  constructor (props) {
    super(props);

    const { abi } = config.contracts.smartLocker;
    const { address } = this.props;

    this.state = { key: '', error: '' };
    this.smartLocker = new SmartLockerContract(abi, address);
  }

  render () {
    return (
      <div className="subview management-subview">
        { this.onlyKeyWarning() }

        <form onSubmit={this.handleAuth.bind(this)}>
          <Input
            autoComplete="off"
            spellCheck="false"
            label="Device Address:"
            autoFocus={true}
            onChange={this.handleInput.bind(this)}
            error={this.state.error}
            value={this.state.key} />

          <Button tabIndex={-1}
                  type="button"
                  icon="tick"
                  disabled={!this.state.key}
                  onClick={this.handleAuth.bind(this)}>
            Authorize
          </Button>
        </form>

      </div>
    );
  }

  handleInput (e) {
    this.setState({ error: '' });
    this.setState({ key: e.target.value });
  }

  handleAuth (e) {
    e.preventDefault();
    this.setState({ key: '', error: '' });
    this.smartLocker
        .addKey(this.state.key)
        .then(this.props.addPendingTx)
        .catch(() => this.setState({ error: 'Invalid address' }));
  }

  onlyKeyWarning () {
    if (this.props.locker.onlyKey)
      return (
        <div className="only-key-warning">
          <p>
            You have no other devices connected to your Smart Locker.
          </p>
          <p>
            Link another device for backup and recovery purposes.
          </p>
        </div>
      )
    else
      return null;
  }
}

const mapState = ({ locker, address }) => ({
  locker,
  address
});

const mapDispatch = dispatch => ({
  addPendingTx : bindActionCreators(addPendingTx, dispatch)
});

export default connect(mapState, mapDispatch)(ManagementSubview);
