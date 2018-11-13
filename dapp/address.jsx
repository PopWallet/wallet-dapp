import React from 'react'
import { connect } from 'react-redux'

import RpcComponent from './rpc_component'

class Address extends RpcComponent {
  constructor (props) {
    super(props);
    this.get = 'address';
  }

  render () {
    return (
      <div className="address">
        { this.props.address }
      </div>
    )
  }
}

export default connect(({ address }) => ({ address }))(Address);