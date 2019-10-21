import React, { Component } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import autobind from 'autobind-decorator';
import Decimal from 'decimal.js-light';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import wrapWithPanel from '../panel';
import ZeroFormattedNumber from '../common/zeroFormattedNumber';
import combineDeep from './deep';
import SimpleSelect from '../common/simpleSelect';
import { Tooltip } from '../../lib/antd';

import './style.scss';

class OrderBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'all',
      deep: '0',
    };
  }
  componentDidMount() {
    this.props.onTitleContentChange(this.getPanelTitleContent());
  }
  getPanelTitleContent() {
    const { mode, deep } = this.state;
    const { basicInfo } = this.props;
    const tools = [
      <Tooltip title={<FormattedMessage id="orderbook_all" />} key="0">
        <span
          className={classnames('simple-btn m-hide', { active: mode === 'all' })}
          onClick={this.handleModeChange.bind(this, 'all')}
        >
          <div className="slide-all">
            <i className="anticon anticon-verticle-left slide-buy" />
            <i className="anticon anticon-verticle-left slide-sell" />
          </div>
        </span>
      </Tooltip>,
      <Tooltip title={<FormattedMessage id="orderbook_buy" />} key="1">
        <span
          className={classnames('simple-btn m-hide', { active: mode === 'buy' })}
          onClick={this.handleModeChange.bind(this, 'buy')}
        >
          <i className="anticon anticon-verticle-left slide-buy" />
        </span>
      </Tooltip>,
      <Tooltip title={<FormattedMessage id="orderbook_sell" />} key="2">
        <span
          className={classnames('simple-btn m-hide', { active: mode === 'sell' })}
          onClick={this.handleModeChange.bind(this, 'sell')}
        >
          <i className="anticon anticon-verticle-left slide-sell" />
        </span>
      </Tooltip>,
      <Tooltip title={<FormattedMessage id="orderbook_deep" />} key="3">
        <span
          className="simple-btn deep"
        >
          <SimpleSelect value={deep} onChange={this.handleDeepChange}>
            {basicInfo.deepSelectOptions.map((o, i) => (
              <DeepOption i={i} key={i} deepSelect={o} />
            ))}
          </SimpleSelect>
        </span>
      </Tooltip>,
    ];
    tools.reverse();
    return tools;
  }
  getMax(asks, bids) {
    const bidsMax = bids.length === 0 ? 0 : bids[bids.length - 1][3];
    const asksMax = asks.length === 0 ? 0 : asks[asks.length - 1][3];
    return Math.max(bidsMax, asksMax);
  }

  handleMyOrders(data) {
    const ret = data.map((item) => {
      const ele = [];
      ele[0] = item.price;
      ele[1] = item.volume;
      return ele;
    });
    return ret;
  }

  processDeepData(trades, myOrders) {
    const deep = this.state.deep;
    const step = this.props.basicInfo.deepSelectOptions[deep].step;
    const deepRet = combineDeep(trades, step);
    const processMyOrders = this.handleMyOrders(myOrders);
    const deepMyOrder = combineDeep(processMyOrders, step);
    const ret = deepRet.map((item) => {
      if (deepMyOrder.find(ele => parseFloat(ele[0]) === parseFloat(item[0]))) {
        item.push('myOrder');
      }
      return item;
    });
    return ret;
  }
  handleAskPriceClick(price) {
    const deep = this.state.deep;
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
    const deep = this.state.deep;
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
  handleModeChange(mode) {
    this.setState({
      mode,
    }, () => {
      this.props.onTitleContentChange(this.getPanelTitleContent());
    });
  }
  @autobind
  handleDeepChange(deep) {
    this.setState({
      deep: deep.target.value,
    }, () => {
      this.props.onTitleContentChange(this.getPanelTitleContent());
    });
  }
  render() {
    const { data, basicInfo, myOrders } = this.props;
    const bidMyOrders = myOrders.filter(node => node.kind === 'bid');
    const askMyOrders = myOrders.filter(node => node.kind === 'ask');
    const { mode } = this.state;
    const { bids, asks } = data;
    const deepAsks = this.processDeepData(asks, askMyOrders);
    const deepBids = this.processDeepData(bids, bidMyOrders);
    const max = this.getMax(deepAsks, deepBids);
    return (
      <div id="orderBook">
        <div className="order-book flex-fixed">
          <div className="order-book-row thead light-text">
            <div className="order-book-row-content">
              <div className="order-book-col price"><FormattedMessage id="orderbook_price" /></div>
              <div className="order-book-col amount"><FormattedMessage id="orderbook_amount" /></div>
              <div className="order-book-col total m-hide"><FormattedMessage id="orderbook_total" /></div>
            </div>
          </div>
        </div>
        <div className={classnames('order-book-container', `mode-${mode}`)}>
          <div className="order-book asks">
            {deepAsks.map((row, i) => (
              // <div className="order-book-row flex-fixed" key={i} onClick={this.handleAskPriceClick.bind(this, row[0])}>
              <div className={classnames('order-book-row flex-fixed', row[4] ? 'my-order' : '')} key={i} onClick={this.handleAskPriceClick.bind(this, row[0])}>
                <div className="order-book-bar" style={{ width: `${row[3] * 100 / max}%` }} />
                <div className="order-book-row-content">
                  <div className="order-book-col price">
                    <tt className="red-text"><ZeroFormattedNumber value={row[0]} fixed={basicInfo.ask_config.price_fixed} /></tt>
                  </div>
                  <div className="order-book-col amount">
                    <tt><ZeroFormattedNumber value={row[1]} fixed={basicInfo.ask_config.amount_fixed} /></tt>
                  </div>
                  <div className="order-book-col total m-hide">
                    <tt><ZeroFormattedNumber value={row[2]} fixed={basicInfo.ask_config.price_fixed} /></tt>
                  </div>
                </div>
              </div>
              )
            )}
          </div>
          {this.props.children}
          <div className="order-book bids">
            {deepBids.map((row, i) => (
              <div className={classnames('order-book-row flex-fixed', row[4] ? 'my-order' : '')} key={i} onClick={this.handleBidPriceClick.bind(this, row[0])}>
                <div className="order-book-bar" style={{ width: `${row[3] * 100 / max}%` }} />
                <div className="order-book-row-content">
                  <div className="order-book-col price">
                    <tt className="green-text"><ZeroFormattedNumber value={row[0]} fixed={basicInfo.bid_config.price_fixed} /></tt>
                  </div>
                  <div className="order-book-col amount">
                    <tt><ZeroFormattedNumber value={row[1]} fixed={basicInfo.bid_config.amount_fixed} /></tt>
                  </div>
                  <div className="order-book-col total m-hide">
                    <tt><ZeroFormattedNumber value={row[2]} fixed={basicInfo.bid_config.price_fixed} /></tt>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ market, account }) {
  return {
    data: market.orderBook,
    basicInfo: market.currentBasicInfo,
    myOrders: account.orders,
  };
}

const DeepOption = injectIntl(({ i, deepSelect, intl }) => (
  <option value={i.toString()} key={i}>{deepSelect.text(intl)}</option>
));


export default wrapWithPanel(connect(mapStateToProps)(OrderBook), {
  title: <span />,
  className: 'orderBook-panel m-part-trade',
});
