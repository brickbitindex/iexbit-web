import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import ZeroFormattedNumber from '../common/zeroFormattedNumber';

import './style.scss';

class Trades extends Component {
  handlePriceClick(row) {
    const type = row.type === 'buy' ? 'order/updateBidPrice' : 'order/updateAskPrice';
    this.props.dispatch({
      type,
      payload: row.price,
    });
  }
  render() {
    const { data, basicInfo } = this.props;
    return (
      <div id="trades">
        <div className="trades-row thead light-text">
          <div className="trades-col time"><FormattedMessage id="trades_time" /></div>
          <div className="trades-col price"><FormattedMessage id="trades_price" /></div>
          <div className="trades-col amount"><FormattedMessage id="trades_amount" /></div>
        </div>
        {data.map((row, i) => (
          <div className="trades-row" key={i} onClick={this.handlePriceClick.bind(this, row)}>
            <div className="trades-col time light-text">
              <tt>{moment(row.date * 1000).format('HH:mm:ss')}</tt>
            </div>
            <div className={classnames('trades-col price', row.type === 'buy' ? 'green-text' : 'red-text')}>
              <tt><ZeroFormattedNumber value={row.price} fixed={basicInfo.ask_config.price_fixed} /></tt>
            </div>
            <div className="trades-col amount">
              <tt><ZeroFormattedNumber value={row.amount} fixed={basicInfo.ask_config.amount_fixed} /></tt>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps({ market }) {
  return {
    data: market.trades,
    basicInfo: market.currentBasicInfo,
  };
}

export default wrapWithPanel(connect(mapStateToProps)(Trades), {
  title: <FormattedMessage id="trades" />,
  className: 'trades-panel',
});
