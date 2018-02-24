import React, { Component } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
// import autobind from 'autobind-decorator';
// import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import ZeroFormattedNumber from '../common/zeroFormattedNumber';

import './style.scss';

class OrderBook extends Component {
  handleAskPriceClick(price) {
    this.props.dispatch({
      type: 'order/updateAskPrice',
      payload: price,
    });
  }
  handleBidPriceClick(price) {
    this.props.dispatch({
      type: 'order/updateBidPrice',
      payload: price,
    });
  }
  render() {
    const { data, basicInfo } = this.props;
    const { bids, asks, max } = data;
    return (
      <div id="orderBook">
        <div className="order-book-container">
          <div className="order-book flex-fixed">
            <div className="order-book-row thead light-text">
              <div className="order-book-col price"><FormattedMessage id="orderbook_price" /></div>
              <div className="order-book-col amount"><FormattedMessage id="orderbook_amount" /></div>
              <div className="order-book-col total"><FormattedMessage id="orderbook_total" /></div>
            </div>
          </div>
          <div className="order-book bids flex-autofixed">
            {bids.map((row, i) => (
              <div className="order-book-row flex-fixed" key={i} onClick={this.handleBidPriceClick.bind(this, row[0])}>
                <div className="order-book-col price">
                  <tt className="green-text"><ZeroFormattedNumber value={row[0]} fixed={basicInfo.bid_config.price_fixed} /></tt>
                </div>
                <div className="order-book-col amount">
                  <tt><ZeroFormattedNumber value={row[1]} fixed={basicInfo.bid_config.amount_fixed} /></tt>
                </div>
                <div className="order-book-col total">
                  <tt><ZeroFormattedNumber value={row[2]} fixed={basicInfo.bid_config.price_fixed} /></tt>
                </div>
                <div className="order-book-bar" style={{ width: `${row[3] * 100 / max}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="order-book-container">
          <div className="order-book flex-fixed">
            <div className="order-book-row thead light-text">
              <div className="order-book-col price"><FormattedMessage id="orderbook_price" /></div>
              <div className="order-book-col amount"><FormattedMessage id="orderbook_amount" /></div>
              <div className="order-book-col total"><FormattedMessage id="orderbook_total" /></div>
            </div>
          </div>
          <div className="order-book asks flex-autofixed">
            {asks.map((row, i) => (
              <div className="order-book-row flex-fixed" key={i} onClick={this.handleAskPriceClick.bind(this, row[0])}>
                <div className="order-book-col price">
                  <tt className="red-text"><ZeroFormattedNumber value={row[0]} fixed={basicInfo.ask_config.price_fixed} /></tt>
                </div>
                <div className="order-book-col amount">
                  <tt><ZeroFormattedNumber value={row[1]} fixed={basicInfo.ask_config.amount_fixed} /></tt>
                </div>
                <div className="order-book-col total">
                  <tt><ZeroFormattedNumber value={row[2]} fixed={basicInfo.ask_config.price_fixed} /></tt>
                </div>
                <div className="order-book-bar" style={{ width: `${row[3] * 100 / max}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ market }) {
  return {
    data: market.orderBook,
    basicInfo: market.currentBasicInfo,
  };
}

export default wrapWithPanel(connect(mapStateToProps)(OrderBook), {
  title: <FormattedMessage id="orderbook" />,
  className: 'orderBook-panel',
});
