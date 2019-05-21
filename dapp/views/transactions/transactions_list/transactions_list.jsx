import React                   from 'react'
import { connect }             from 'react-redux'
import Transaction             from './transaction'
import { Preloader, Bouncing } from '@poplocker/react-ui'
import { RegistrarContract }   from 'lib/contracts'
import { rpc }                 from 'lib/rpc_calls'

import './transactions_list.css'

class TransactionList extends React.Component {
  constructor (props) {
    super(props);
    this.createRegistrar();
  }

  componentDidMount() {
    this.startPolling();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  startPolling() {
    this.pollForStatus();
    this.timer = setInterval(() => this.pollForStatus(), 4000);
  }

  pollForStatus() {
    this.props.dispatch(rpc.fetchTxHistory());
  }

  componentDidUpdate() {
    this.createRegistrar();
  }

  createRegistrar() {
    if (!this.registrar && this.props.locker.registrar) {
      const { abi } = config.contracts.registrar;
      const { address } = this.props.locker.registrar;
      this.registrar = new RegistrarContract(abi, address);
    }
  }

  listEmpty() {
    return !this.props.pendingTxs.length && (!this.props.txHistory || !this.props.txHistory.length);
  }

  render() {
    return (
      <Preloader value={this.props.txHistory != null} loader={Bouncing}>
        {this.list()}
        <div className="fade-out"/>
      </Preloader>
    )
  }

  list() {
    if (!this.listEmpty())  {
      return (
        <div className="transactions-list">
          {this.transactions(this.props.pendingTxs, "pending")}
          {this.transactions(this.props.txHistory, "complete")}
        </div>
      )
    } else {
      return (
        <div className="transactions-list">
          <div className="no-transaction">There are no transactions yet</div>
        </div>
      )
    }
  }

  transactions(txs, status) {
    return (
      <>
        {txs.map((tx, index) => (
          <Transaction
            tx={tx}
            txListAddress={this.props.txListAddress}
            registrar={this.registrar}
            status={status}
            key={index} />
        ))}
      </>
    )
  }
}

const mapStore = ({ txHistory, pendingTxs, txListAddress, locker }) => ({
  txHistory,
  pendingTxs,
  txListAddress,
  locker
});

export default connect(mapStore)(TransactionList);
