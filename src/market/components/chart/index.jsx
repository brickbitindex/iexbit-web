import React, { Component } from 'react';
import { connect } from 'dva';
// import autobind from 'autobind-decorator';
// import classnames from 'classnames';
// import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import Datefeed from './datafeed';
import overrides from './overrides';

import './style.scss';

function objToForm(inData, prefix = '') {
  const ret = {};
  Object.keys(inData).forEach((key) => {
    const child = inData[key];
    if (typeof child === 'object') {
      const childRet = objToForm(child, prefix + key + '.');
      Object.keys(childRet).forEach((childKey) => {
        ret[childKey] = childRet[childKey];
      });
    } else {
      ret[prefix + key] = child;
    }
  });
  return ret;
}

class Chart extends Component {
  constructor(props) {
    super(props);
    this.tvWidget = undefined;
  }
  componentDidMount() {
    const TradingView = window.TradingView;
    TradingView.onready(() => {
      this.initWidget();
    });
  }
  initWidget() {
    const TradingView = window.TradingView;
    const symbol = this.props.market;
    this.tvWidget = new TradingView.widget({
      symbol: 'Cool.bi:' + symbol,
      interval: '15',
      container_id: 'chart',
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new Datefeed(symbol),
      library_path: '/tv/',
      locale: 'zh',
      // Regression Trend-related functionality is not implemented yet, so it's hidden for a while
      drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
      // TODO: 禁用
      disabled_features: ['use_localstorage_for_settings', 'header_symbol_search', 'header_interval_dialog_button', 'header_compare', 'header_undo_redo', 'header_fullscreen_button', 'header_saveload'],
      // TODO: 禁用了
      // enabled_features: ["study_templates"],
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      autosize: true,
      timezone: 'Asia/Shanghai',
      overrides: objToForm(overrides),
    });
  }
  render() {
    return (
      <div id="chart" />
    );
  }
}

function mapStateToProps({ market }) {
  return { market: market.pairSymbol };
}

export default wrapWithPanel(connect(mapStateToProps)(Chart), {
  className: 'chart-panel',
});

