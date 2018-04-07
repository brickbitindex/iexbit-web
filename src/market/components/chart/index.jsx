import React, { Component } from 'react';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
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

const $ = window.$;

class Chart extends Component {
  constructor(props) {
    super(props);
    this.tvWidget = undefined;
  }
  componentDidMount() {
    this.initWidget();
  }
  @autobind
  chartReady(/* messages*/) {
    // TODO:
    // console.log(messages);
    const buttonArr = [{
      value: '1',
      text: '1min',
    }, {
      value: '5',
      text: '5min',
    }, {
      value: '15',
      text: '15min',
    }, {
      value: '30',
      text: '30min',
    }, {
      value: '60',
      text: '1hour',
    }, {
      value: '120',
      text: '2hour',
    }, {
      value: '240',
      text: '4hour',
    }, {
      value: '360',
      text: '6hour',
    }, {
      value: '720',
      text: '12hour',
    }, {
      value: '1D',
      text: '日线',
    }, {
      value: '1W',
      text: '周线',
    }];

    let btn = {};

    const handleClick = (e, value) => {
      this.tvWidget.chart().setResolution(value);
      $(e.target).addClass('select')
        .closest('div.space-single')
        .siblings('div.space-single')
        .find('div.button')
        .removeClass('select');
    };
    buttonArr.forEach((v) => {
      btn = this.tvWidget.createButton().on('click', (e) => {
        handleClick(e, v.value);
      });
      btn[0].innerHTML = v.text;
      btn[0].title = v.text;
      $(btn[0]).addClass('resolution-btn');
      if (v.value === '15') {
        $(btn[0]).addClass('select');
      }
    });
  }
  initWidget() {
    const TradingView = window.TradingView;
    const symbol = this.props.symbol;
    const pair = this.props.pair;
    this.tvWidget = new TradingView.widget({
      symbol: 'Bitrabbit' + symbol,
      interval: '15',
      container_id: 'chart',
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new Datefeed(symbol, pair, this.props.basicInfo, this.chartReady),
      library_path: '/tv/',
      locale: 'zh',
      // Regression Trend-related functionality is not implemented yet, so it's hidden for a while
      drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
      // TODO: 禁用
      // disabled_features: [
      //   'use_localstorage_for_settings',
      //   'header_symbol_search',
      //   'header_interval_dialog_button',
      //   'header_compare',
      //   'header_undo_redo',
      //   'header_fullscreen_button',
      //   'header_saveload',
      //   'left_toolbar',
      // ],
      disabled_features: [
        'header_symbol_search',
        'use_localstorage_for_settings',
        'symbol_search_hot_key',
        'header_chart_type',
        'header_compare',
        'header_undo_redo',
        'header_screenshot',
        'header_saveload',
        'timeframes_toolbar',
        'context_menus',
        'left_toolbar',
        'header_indicators', // 图表指标
        // 'header_settings', // 设置
        'header_resolutions',  // 时间下拉框
        // 'header_fullscreen_button' //全屏按钮
      ],
      // TODO: 禁用了
      enabled_features: ['study_templates'],
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      autosize: true,
      timezone: 'Asia/Shanghai',
      overrides: objToForm(overrides),
      studies_overrides: {
        'volume.volume.color.0': 'rgba(240, 77, 100, 0.2)',
        'volume.volume.color.1': 'rgba(61, 231, 119, 0.2)',
        // 'volume.volume.transparency': 0,
        // 'volume.volume ma.color': '#FF0000',
        // 'volume.volume ma.transparency': 30,
        // 'volume.volume ma.linewidth': 5,
        // 'volume.show ma': true,
        // 'volume.options.showStudyArguments': false,
        // 'bollinger bands.median.color': '#33FF88',
        // 'bollinger bands.upper.linewidth': 7,
      },
      // overrides: {},
      time_frames: [],
      // toolbar_bg: '#181818',
    });
  }
  render() {
    return (
      <div id="chart" />
    );
  }
}

function mapStateToProps({ market, i18n }) {
  return {
    symbol: market.pairSymbol,
    pair: market.pair,
    basicInfo: market.currentBasicInfo,
    messages: i18n.messages,
  };
}

export default wrapWithPanel(connect(mapStateToProps)(Chart), {
  className: 'chart-panel',
});

