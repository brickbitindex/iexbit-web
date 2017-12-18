import React, { Component } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
// import autobind from 'autobind-decorator';
// import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';

import './style.scss';

class OrderBook extends Component {
  render() {
    const { data } = this.props;
    const { bids, asks, max } = data;
    return (
      <div id="orderBook">
        <div className="order-book bids">
          <div className="order-book-row thead light-text">
            <div className="order-book-col total"><FormattedMessage id="orderbook_total" /></div>
            <div className="order-book-col amount"><FormattedMessage id="orderbook_amount" /></div>
            <div className="order-book-col price"><FormattedMessage id="orderbook_price" /></div>
          </div>
          {bids.map((row, i) => (
            <div className="order-book-row" key={i}>
              <div className="order-book-col total">
                <tt>{row[2]}</tt>
              </div>
              <div className="order-book-col amount">
                <tt>{row[1]}</tt>
              </div>
              <div className="order-book-col price">
                <tt>{row[0]}</tt>
              </div>
              <div className="order-book-bar" style={{ width: `${row[3] * 100 / max}%` }} />
            </div>
          ))}
        </div>
        <div className="order-book asks">
          <div className="order-book-row thead light-text">
            <div className="order-book-col price"><FormattedMessage id="orderbook_price" /></div>
            <div className="order-book-col amount"><FormattedMessage id="orderbook_amount" /></div>
            <div className="order-book-col total"><FormattedMessage id="orderbook_total" /></div>
          </div>
          {asks.map((row, i) => (
            <div className="order-book-row" key={i}>
              <div className="order-book-col price">
                <tt>{row[0]}</tt>
              </div>
              <div className="order-book-col amount">
                <tt>{row[1]}</tt>
              </div>
              <div className="order-book-col total">
                <tt>{row[2]}</tt>
              </div>
              <div className="order-book-bar" style={{ width: `${row[3] * 100 / max}%` }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ market }) {
  return { data: market.orderBook };
}

export default wrapWithPanel(connect(mapStateToProps)(OrderBook), {
  title: <FormattedMessage id="orderbook" />,
  slideable: true,
  className: 'orderBook-panel',
});
