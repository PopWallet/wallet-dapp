import React        from 'react'
import * as R       from 'pro-router/standalone'
import * as _       from 'lodash'
import Transactions from 'views/transactions'
import Send         from 'views/send'
import Receive      from 'views/receive'

import './view.css'

export default class View extends React.Component {
  constructor (props) {
    super(props);

    R.init({
      root: 'transactions',
      views: ['transactions', 'send', 'receive'],
      render: () => {this.forceUpdate(); this.render()},
      helpers: _
    });
  }

  view (name) {
    switch (name) {

      case 'transactions':
        return <Transactions/>

      case 'send':
        return <Send/>

      case 'receive':
        return <Receive/>

      default:
        return (
          <div className="not-found">
            Page Not Found
          </div>
        )
    }
  }

  render () {
    return this.view(window.R.view);
  }
}