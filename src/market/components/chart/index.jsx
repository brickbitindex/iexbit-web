import React, { Component } from 'react';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import Datefeed from './datafeed';
import overrides from './overrides';
import { Tooltip, Icon } from '../../lib/antd';
import SimpleSelect from '../common/simpleSelect';

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
  text: 'Day',
}, {
  value: '1W',
  text: 'Week',
}];

const lang = {
  en: 'en',
  'zh-CN': 'zh',
  'zh-TW': 'zh_TW',
};

const chartTypes = [{
  value: 0,
  text: 'bars',
}, {
  value: 1,
  text: 'candles',
}, {
  value: 9,
  text: 'hollow_candles',
}, {
  value: 8,
  text: 'heiken_ashi',
}, {
  value: 2,
  text: 'line',
}, {
  value: 3,
  text: 'area',
}, {
  value: 10,
  text: 'baseline',
}];

class Chart extends Component {
  constructor(props) {
    super(props);
    this.tvWidget = undefined;
    this.inited = false;
    this.state = {
      loading: true,
      resolution: '15',
      chartType: 9,
      studies: {
        ma7: null,
        ma25: null,
        ma99: null,
        rsi: null,
        macd: null,
      },
    };
  }
  componentDidMount() {
    this.initWidget();
    this.props.onTitleContentChange(this.getPanelTitleContent());
  }
  getPanelTitleContent() {
    const { studies, chartType, resolution, loading } = this.state;
    const { messages } = this.props;
    if (loading) return [];
    const tools = [
      <Tooltip title={<FormattedMessage id="tv_type" />} key="0">
        <span className="simple-btn tooltip-container with-select">
          <SimpleSelect value={chartType} onChange={this.handleChangeChartType}>
            {chartTypes.map((b => (
              <option value={b.value} key={b.value}>{messages['tv_type_' + b.text]}</option>
            )))}
          </SimpleSelect>
        </span>
      </Tooltip>,
      <span className="divider" key="1" />,
      <Tooltip title={<FormattedMessage id="tv_select_resolution" />} key="2">
        <span className="simple-btn tooltip-container with-select" >
          <SimpleSelect value={resolution} onChange={this.handleChangeResolution}>
            {buttonArr.map((b => (
              <option value={b.value} key={b.value}>{b.text}</option>
            )))}
          </SimpleSelect>
        </span>
      </Tooltip>,
      <span className="divider" key="3" />,
      <span className={classnames('simple-btn text', { active: studies.ma7 })} onClick={this.handleTriggerStudy.bind(this, 'ma7')} key="4">MA(7)</span>,
      <span className={classnames('simple-btn text', { active: studies.ma25 })} onClick={this.handleTriggerStudy.bind(this, 'ma25')} key="5">MA(25)</span>,
      <span className={classnames('simple-btn text', { active: studies.rsi })} onClick={this.handleTriggerStudy.bind(this, 'rsi')} key="6">RSI</span>,
      <span className={classnames('simple-btn text', { active: studies.macd })} onClick={this.handleTriggerStudy.bind(this, 'macd')} key="7">MACD</span>,
      <span className={classnames('simple-btn text', { active: studies.bb })} onClick={this.handleTriggerStudy.bind(this, 'bb')} key="8">BB</span>,
      <Tooltip title={<FormattedMessage id="tv_fullscreen" />} key="9">
        <span className="simple-btn tooltip-container fullscreen" onClick={this.handleFullScreen}>
          <Icon type="arrows-alt" />
        </span>
      </Tooltip>,
    ];
    return tools;
  }
  @autobind
  chartReady(/* messages*/) {
    if (this.inited) return;
    this.inited = true;
    // TODO:
    // console.log(messages);

    // let btn = {};

    // const handleClick = (e, value) => {
    //   this.tvWidget.chart().setResolution(value);
    //   $(e.target).addClass('select')
    //     .closest('div.space-single')
    //     .siblings('div.space-single')
    //     .find('div.button')
    //     .removeClass('select');
    // };
    // buttonArr.forEach((v) => {
    //   btn = this.tvWidget.createButton().on('click', (e) => {
    //     handleClick(e, v.value);
    //   });
    //   btn[0].innerHTML = v.text;
    //   btn[0].title = v.text;
    //   $(btn[0]).addClass('resolution-btn');
    //   if (v.value === '15') {
    //     $(btn[0]).addClass('select');
    //   }
    // });

    const $h = $('head', $('#chart iframe').contents());
    const $w = $('#chart iframe')[0].contentWindow;
    // 默认隐藏顶部文字
    $h.append(`
      <script>
        window.clickLegend = function() {
          $('.pane-legend-minbtn').click();
        }
      </script>
    `);
    $w.clickLegend();
    // 默认收起顶部栏
    $h.append(`
    <script>
      window.hideTopToolbar = function() {
        $('.tv-close-panel.top').click().css('display', 'none');
      }
    </script>
    `);
    $w.hideTopToolbar();
    // 设置全屏函数
    $h.append(`
    <script>
      window.triggerFullscreen = function() {
        $('.button.fullscreen').click();
      }
    </script>
    `);
    this.setState({
      loading: false,
    }, () => {
      this.props.onTitleContentChange(this.getPanelTitleContent());
    });

    // 设置指标学习
    this.handleTriggerStudy('ma7');
    this.handleTriggerStudy('ma25');
  }
  initWidget() {
    const TradingView = window.TradingView;
    const symbol = this.props.symbol;
    const pair = this.props.pair;
    const datafeed = new Datefeed(symbol, pair, this.props.basicInfo, this.chartReady);
    this.props.dispatch({
      type: 'market/updateState',
      payload: {
        datafeed,
      },
    });
    this.tvWidget = new TradingView.widget({
      symbol: 'Bitrabbit' + symbol,
      interval: '15',
      container_id: 'chart',
      // BEWARE: no trailing slash is expected in feed URL
      datafeed,
      library_path: '/tv/',
      locale: lang[this.props.locale],
      // Regression Trend-related functionality is not implemented yet, so it's hidden for a while
      drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
      // TODO: 禁用
      disabled_features: [
        'header_symbol_search',
        'use_localstorage_for_settings',
        'symbol_search_hot_key',
        // 'header_chart_type',
        'header_compare',
        'header_undo_redo',
        'header_screenshot',
        'header_saveload',
        'timeframes_toolbar',
        'context_menus',
        'left_toolbar',
        'header_indicators', // 图表指标
        'header_settings', // 设置
        // 'header_resolutions',  // 时间下拉框
        // 'header_fullscreen_button' //全屏按钮
        // 'format_button_in_legend', // 顶端标题里study的设置按钮
        'volume_force_overlay', // 交易量分离
      ],
      // TODO: 启用了
      enabled_features: [
        'dont_show_boolean_study_arguments',
        'hide_last_na_study_output',
      ],
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
  @autobind
  handleFullScreen() {
    const $w = $('#chart iframe')[0].contentWindow;
    $w.triggerFullscreen();
  }
  @autobind
  handleChangeResolution(e) {
    const value = e.target.value;
    this.tvWidget.chart().setResolution(value);
    this.setState({
      resolution: value,
    }, () => {
      this.props.onTitleContentChange(this.getPanelTitleContent());
    });
  }
  @autobind
  handleChangeChartType(e) {
    const value = parseInt(e.target.value, 10);
    this.tvWidget.chart().setChartType(value);
    this.setState({
      chartType: value,
    }, () => {
      this.props.onTitleContentChange(this.getPanelTitleContent());
    });
  }
  handleTriggerStudy(name) {
    const studies = this.state.studies;
    if (studies[name]) {
      // 取消
      this.tvWidget.chart().removeEntity(studies[name]);
      studies[name] = null;
    } else {
      let entry = null;
      // 添加
      switch (name) {
        case 'ma7':
          entry = this.tvWidget.chart().createStudy('Moving Average', true, false, [7], null, { 'Plot.color': '#9562c2' });
          break;
        case 'ma25':
          entry = this.tvWidget.chart().createStudy('Moving Average', true, false, [25], null, { 'Plot.color': '#85abd3' });
          break;
        case 'ma99':
          entry = this.tvWidget.chart().createStudy('Moving Average', true, false, [99]);
          break;
        case 'rsi':
          entry = this.tvWidget.chart().createStudy('Relative Strength Index', false, false, [14]);
          break;
        case 'macd':
          entry = this.tvWidget.chart().createStudy('MACD', false, false, [12, 16, 'close', 9]);
          break;
        case 'bb':
          entry = this.tvWidget.chart().createStudy('Bollinger Bands', true, false, [20, 2]);
          break;

        default:
          break;
      }
      studies[name] = entry;
    }
    this.setState({
      studies: { ...studies },
    }, () => {
      this.props.onTitleContentChange(this.getPanelTitleContent());
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
    locale: i18n.locale,
  };
}

export default wrapWithPanel(connect(mapStateToProps)(Chart), {
  title: <span />,
  className: 'chart-panel chart-container',
});

