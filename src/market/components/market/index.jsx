import React, { Component } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
// import Select from 'react-select';
import classnames from 'classnames';
// import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import ZeroFormattedNumber from '../common/zeroFormattedNumber';
import { Select } from '../../lib/antd';

import './style.scss';

const fontSize = {
  1: 35,
  2: 35,
  3: 35,
  4: 35,
  5: 35,
  6: 35,
  7: 31,
  8: 31,
  9: 31,
  10: 27,
  11: 24,
  12: 22,
  13: 22,
  14: 21,
};

let maxLength = 0;
let fs = '22px';
const Option = Select.Option;

// icon: `/market_images/symbol_icon_${pairSymbol}.png`

class Market extends Component {
  constructor(props) {
    super(props);
    if (props.locale === 'zh-CN') {
      this.state = {
        defaultChecked: 'cny',
        size: 'small',
      };
    } else {
      this.state = {
        defaultChecked: 'usdt',
        size: 'small',
      };
    }
  }
  componentWillReceiveProps(props) {
    const currentTrade = props.currentTrade;
    const currentPrice = currentTrade.price;
    $('head title').html(currentPrice);
  }
  getValue() {
    const { currentTrade, quoteUnitUsdtPrice, usdtRate } = this.props;
    const { defaultChecked } = this.state;
    const currentPrice = currentTrade.price;
    if (defaultChecked === 'usdt' && quoteUnitUsdtPrice === 1) return currentPrice;
    const value = quoteUnitUsdtPrice * parseFloat(currentPrice);
    if (defaultChecked === 'cny') return (value * usdtRate).toFixed(3);
    return value.toFixed(3);
  }
  handleChangeUnit = (value) => {
    this.setState({ defaultChecked: value });
  }
  render() {
    const { data, currentTrade, basicInfo } = this.props;
    const { defaultChecked } = this.state;
    const { size } = this.state;
    const currentPrice = currentTrade.price;
    const change = data.change;
    const down = data.down;
    // const baseUnit = basicInfo.base_unit.code;
    const quoteUnit = basicInfo.quote_unit.code;
    const value = this.getValue();

    if (currentPrice.length > maxLength) {
      if (basicInfo.ask_config.price_fixed === 0) {
        maxLength = currentPrice.length;
      } else {
        maxLength = currentPrice.split('.')[0].length + 1 + basicInfo.ask_config.price_fixed;
      }
      fs = fontSize[maxLength] + 'px';
    }

    return (
      <div id="market">
        <div className="market-row">
          <div className="market-current tt">
            <div className={classnames(currentTrade.type === 'buy' ? 'green-text' : 'red-text')} style={{ fontSize: fs, height: fs, lineHeight: fs }}>
              <ZeroFormattedNumber value={currentPrice} fixed={basicInfo.ask_config.price_fixed} />
            </div>
            <div className="market-value tt light-text">≈ {value}
              <Select
                defaultValue={defaultChecked}
                onChange={this.handleChangeUnit}
                size={size}
                className="color"
              >
                <Option value="usdt">USDT</Option>
                <Option value="cny">CNY</Option>
              </Select>
            </div>
          </div>
          <div>
            <div className="market-info light-text" style={{ height: fs, lineHeight: fs + 'px' }}>
              <span>{quoteUnit.toUpperCase()}</span>
            </div>
            <div className={classnames('market-change', down ? 'red-text' : 'green-text')}>{down ? '-' : '+'}{Math.abs(change * 100).toFixed(2)}%</div>
          </div>
        </div>
        {/* <div className={classnames('market-detail pop-dialog a-left', { show: this.state.hover })}>
          <div className="market-detail-row">
            <div className="mt"><FormattedMessage id="market_low" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={ticker.low} fixed={3} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
          <div className="market-detail-row">
            <div className="mt"><FormattedMessage id="market_high" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={ticker.high} fixed={3} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
          <div className="market-detail-row">
            <div className="mt"><FormattedMessage id="market_vol" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={ticker.volume} fixed={3} /> <span className="light-text">{baseUnit}</span></div>
          </div>
        </div> */}
      </div>
    );
  }
}

function mapStateToProps({ market, i18n }) {
  let currentTrade = {
    price: 0,
    type: 'buy',
  };
  if (market.trades && market.trades.length > 0) {
    currentTrade = market.trades[0];
  }
  return {
    data: market.current || {},
    currentTrade,
    basicInfo: market.currentBasicInfo,
    locale: i18n.locale,
    quoteUnitUsdtPrice: market.quoteUnitUsdtPrice,
    usdtRate: market.usdtRate,
  };
}

export default wrapWithPanel(connect(mapStateToProps)(Market), {
  className: 'market-panel m-hide',
});

