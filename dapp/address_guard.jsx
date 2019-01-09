import React       from 'react'
import { connect } from 'react-redux'
import { rpc }     from 'lib/rpc_calls'

class Router extends React.Component {
  componentDidMount() {
    this.props.dispatch(rpc.getAddress());
  }

  render () {
    if (this.props.address.length == 0)

  }
}

export default connect(({ address }) => ({ address }))(Router);