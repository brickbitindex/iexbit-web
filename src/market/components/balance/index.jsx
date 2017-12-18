import React, { Component } from 'react';
import { connect } from 'dva';
// import autobind from 'autobind-decorator';
// import classnames from 'classnames';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import wrapWithPanel from '../panel';

import './style.scss';

class Balance extends Component {
  render() {
    const { data } = this.props;
    return (
      <div id="balance">
        {/* <div className="trades-row thead light-text">
          <div className="trades-col time"><FormattedMessage id="trades_time" /></div>
          <div className="trades-col price"><FormattedMessage id="trades_price" /></div>
          <div className="trades-col amount"><FormattedMessage id="trades_amount" /></div>
        </div> */}
        {data.map(d => (
          <div className="balance-row">
            <div className="balance-col currency">{d.currency.toUpperCase()}</div>
            <div className="balance-col balance">
              <div>
                <FormattedNumber value={d.balance} />
              </div>
              <div className="light-text lock">
                <i className="icon anticon icon-lock" /><FormattedNumber value={d.locked} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return { data: account.balance };
}

export default wrapWithPanel(connect(mapStateToProps)(Balance), {
  title: <FormattedMessage id="balance" />,
  className: 'balance-panel',
});
