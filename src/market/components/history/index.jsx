import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';

import './style.scss';

// TODO:
const pricefix = 5;
const amountfix = 2;

class History extends Component {
  render() {
    const { data } = this.props;
    return (
      <div id="history">
        <div className="trades-row thead light-text">
          <div className="trades-col time"><FormattedMessage id="trades_time" /></div>
          <div className="trades-col price"><FormattedMessage id="trades_price" /></div>
          <div className="trades-col amount"><FormattedMessage id="trades_amount" /></div>
        </div>
        {data.map((row, i) => (
          <div className="trades-row" key={i}>
            <div className="trades-col time light-text">
              <tt>{moment(row.timestamp).format('HH:MM:SS')}</tt>
            </div>
            <div className={classnames('trades-col price', row.type === 'buy' ? 'green-text' : 'red-text')}>
              <tt>{row.price.toFixed(pricefix)}</tt>
            </div>
            <div className="trades-col amount">
              <tt>{row.amount.toFixed(amountfix)}</tt>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return { data: account.orders };
}

export default wrapWithPanel(connect(mapStateToProps)(History), {
  title: <FormattedMessage id="history" />,
  slideable: true,
  show: false,
  className: 'history-panel',
});
