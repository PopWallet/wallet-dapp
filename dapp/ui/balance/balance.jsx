import React         from 'react'
import { connect }   from 'react-redux'
import { rpc }       from 'lib/rpc_calls'
import { fixedEth }  from 'lib/helpers'
import { Preloader } from '@poplocker/react-ui'

import './balance.css'

class Balance extends React.Component {

  componentDidUpdate () {
    this.props.dispatch(rpc.getBalance(this.props.address));
  }

  render () {
    return (
      <div className="account-balance">
        <Preloader value={this.props.balance}>
          { fixedEth(this.props.balance || 0) } ETH
        </Preloader>
      </div>
    )
  }
}

export default connect(({ balance, address }) => ({ balance, address }))(Balance);
