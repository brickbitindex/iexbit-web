import React, { Component } from 'react';
import { connect } from 'dva';
// import autobind from 'autobind-decorator';
// import classnames from 'classnames';
// import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import Datefeed from './datafeed';

import './style.scss';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.tvWidget = undefined;
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
      // overrides: {
      //   'paneProperties.background': '#222222',
      //   'paneProperties.vertGridProperties.color': '#454545',
      //   'paneProperties.horzGridProperties.color': '#454545',
      //   'symbolWatermarkProperties.transparency': 90,
      //   'scalesProperties.textColor': '#AAA',
      // },
    });
  }
  componentDidMount() {
    const TradingView = window.TradingView;
    TradingView.onready(() => {
      this.initWidget();
    });
  }
  render() {
    return (
      <div id="chart" />
    );
  }
}

function mapStateToProps({ market }) {
  return { market: market.pair };
}

export default wrapWithPanel(connect(mapStateToProps)(Chart), {
  className: 'chart-panel',
});

