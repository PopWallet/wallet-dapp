import React                       from 'react'
import { connect }                 from 'react-redux'
import { Button, Input, Blipping } from '@poplocker/react-ui'
import { RegistrarContract }       from 'lib/contracts'

import './create_or_link.css'

class CreateOrLink extends React.Component {
  constructor (props) {
    super(props);
    // TODO: find better place for it
    // TODO: address of the registrar
    // should be provided by the extension
    this.registrar = new RegistrarContract(config.contracts.registrar);
    this.state = { name: '', badge: '' };
  }

  render () {
    return (
      <div className="subview create-or-link">
        <div className="title">
          Connect Your Device
        </div>
        <form >

          <Input
            autoComplete="off"
            spellCheck="false"
            name="smartlocker-name"
            label="Smart Locker Name:"
            autoFocus={true}
            maxLength="32"
            badge={this.state.badge}
            badgeType={this.badgeType(this.state.badge)}
            onChange={this.handleInput.bind(this)}
            value={this.state.name} />

        </form>
        <div className="buttons--2row">
          <Button kind="alt" icon="arrow" disabled={this.disabledFor('link')}>Create Locker</Button>
          <Button icon="arrow-up" disabled={this.disabledFor('create')}>Link Device</Button>
        </div>
      </div>
    );
  }

  disabledFor(badgeName) {
    return (
      this.badgeType(this.state.badge) == 'loading'
        || this.state.badge == badgeName
        || !this.state.badge
    );
  }

  badgeType (badge) {
    switch(badge) {
      case 'link':
        return 'info';
      case 'create':
        return 'valid';
      default:
        return 'loading'
    }
  }

  handleInput (e) {
    const name = e.target.value;

    if (name) {
      this.setState({ name, badge: <Blipping/> }, () => {
        this.registrar.getAddressDebounced(this.state.name).then(addr => {
          const badge = (addr) ? 'link' : 'create';
          if (this.state.name) this.setState({ badge });
        });
      });
    }
    else {
      this.setState({ name, badge: '' });
    }

  }
}

export default connect(({ locker }) => ({ locker }))(CreateOrLink);
