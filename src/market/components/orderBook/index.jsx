import React, { Component } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
// import autobind from 'autobind-decorator';
import Decimal from 'decimal.js-light';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import ZeroFormattedNumber from '../common/zeroFormattedNumber';
import combineDeep from './deep';

import './style.scss';

class OrderBook extends Component {
  getMax(asks, bids) {
    const bidsMax = bids.length === 0 ? 0 : bids[bids.length - 1][3];
    const asksMax = asks.length === 0 ? 0 : asks[asks.length - 1][3];
    return Math.max(bidsMax, asksMax);
  }
  processDeepData(trades) {
    const deep = this.props.deep;
    const step = this.props.basicInfo.deepSelectOptions[deep].step;
    const ret = combineDeep(trades, step);
    return ret;
  }
  handleAskPriceClick(price) {
    const deep = this.props.deep;
    const step = this.props.basicInfo.deepSelectOptions[deep].step;
    let payload = price;
    if (step < 1) {
      const times = new Decimal(1).div(step).toString();
      payload = parseFloat(price).toFixed(times.length - 1);
    }
    this.props.dispatch({
      type: 'order/updateAllPrice',
      payload,
    });
  }
  handleBidPriceClick(price) {
    const deep = this.props.deep;
    const step = this.props.basicInfo.deepSelectOptions[deep].step;
    let payload = price;
    if (step < 1) {
      const times = new Decimal(1).div(step).toString();
      payload = parseFloat(price).toFixed(times.length - 1);
    }
    this.props.dispatch({
      type: 'order/updateAllPrice',
      payload,
    });
  }
  render() {
    const { data, basicInfo, mode } = this.props;
    const { bids, asks } = data;
    const deepAsks = this.processDeepData(asks);
    const deepBids = this.processDeepData(bids);
    const max = this.getMax(deepAsks, deepBids);
    return (
      <div id="orderBook">
        <div className="order-book flex-fixed">
          <div className="order-book-row thead light-text">
            <div className="order-book-col price"><FormattedMessage id="orderbook_price" /></div>
            <div className="order-book-col amount"><FormattedMessage id="orderbook_amount" /></div>
            <div className="order-book-col total"><FormattedMessage id="orderbook_total" /></div>
          </div>
        </div>
        <div className={classnames('order-book-container', `mode-${mode}`)}>
          <div className="order-book asks">
            {deepAsks.map((row, i) => (
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
          {this.props.children}
          <div className="order-book bids">
            {deepBids.map((row, i) => (
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
  title: <span />,
  className: 'orderBook-panel',
}, {
  mode: 'all',
  deep: '0',
}, [{
  key: 'all',
  icon: (
    <div className="slide-all">
      <i className="icon anticon icon-verticleleft slide-buy" />
      <i className="icon anticon icon-verticleleft slide-sell" />
    </div>
  ),
  active: state => state.mode === 'all',
  tooltip: <FormattedMessage id="orderbook_all" />,
  onClick(props, setChildProps) {
    setChildProps({
      mode: 'all',
    });
  },
}, {
  key: 'buy',
  icon: <i className="icon anticon icon-verticleleft slide-buy" />,
  active: state => state.mode === 'buy',
  tooltip: <FormattedMessage id="orderbook_buy" />,
  onClick(props, setChildProps) {
    setChildProps({
      mode: 'buy',
    });
  },
}, {
  key: 'sell',
  icon: <i className="icon anticon icon-verticleleft slide-sell" />,
  active: state => state.mode === 'sell',
  tooltip: <FormattedMessage id="orderbook_sell" />,
  onClick(props, setChildProps) {
    setChildProps({
      mode: 'sell',
    });
  },
}, {
  key: 'deep',
  icon(props, store, setChildProps) {
    return (
      <select value={props.deep} onChange={e => setChildProps({ deep: e.target.value })} >
        {store.market.currentBasicInfo.deepSelectOptions.map((o, i) => (
          <option value={i.toString()}>{o.text}</option>
        ))}
      </select>
    );
  },
  tooltip: <FormattedMessage id="orderbook_deep" />,
  className: 'deep',
  onClick() {},
}]);
