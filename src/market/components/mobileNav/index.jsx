import React, { Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import autobind from 'autobind-decorator';
import { FormattedMessage } from 'react-intl';
import { Tabs, Select } from '../../lib/antd';
import ZeroFormattedNumber from '../common/zeroFormattedNumber';

import './style.scss';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class MobileNav extends Component {
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
  @autobind
  handleTabClick(showPart) {
    this.props.dispatch({
      type: 'mobile/updateState',
      payload: {
        showPart,
      },
    });
  }
  render() {
    const { isMobile, showPart, currentTrade, basicInfo, current, loading } = this.props;
    if (!isMobile) return <div className="m-only" />;
    const { defaultChecked } = this.state;
    const value = this.getValue();
    const { size } = this.state;
    const baseUnit = basicInfo.base_unit.code;
    return (
      <div id="mNav" className="m-only m-nav">
        {!loading && (
          <div className="m-market">
            <div>
              <span className={classnames('market-price', currentTrade.type === 'buy' ? 'green-text' : 'red-text')}>
                <ZeroFormattedNumber value={currentTrade.price} fixed={basicInfo.ask_config.price_fixed} />
              </span>
              <span className="market-value tt light-text">≈ {value}
                <Select
                  defaultValue={defaultChecked}
                  onChange={this.handleChangeUnit}
                  size={size}
                  className="color"
                >
                  <Option value="usdt">USDT</Option>
                  <Option value="cny">CNY</Option>
                </Select>
              </span>
            </div>
            <div className="m-market-row">
              <div>
                <span className={classnames('tt', current.down ? 'red-text' : 'green-text')}>
                  {current.down ? '-' : '+'}{Math.abs(current.change * 100).toFixed(2)}%
                </span>
              </div>
              <div>
                <FormattedMessage id="mobile_nav_market_low" /> <span className="mv tt"><ZeroFormattedNumber value={current.low} /></span>
              </div>
            </div>
            <div className="m-market-row">
              <div>
                <FormattedMessage id="mobile_nav_market_vol" /> <span className="tt"><ZeroFormattedNumber value={current.volume} /> <span className="light-text">{baseUnit}</span></span>
              </div>
              <div>
                <FormattedMessage id="mobile_nav_market_high" /> <span className="mv tt"><ZeroFormattedNumber value={current.high} /></span>
              </div>
            </div>
          </div>
        )}
        <Tabs
          className="m-nav-tabs"
          activeKey={showPart}
          onChange={this.handleTabClick}
        >
          <TabPane key="market" tab={<FormattedMessage id="mobile_nav_market" />} />
          <TabPane key="trade" tab={<FormattedMessage id="mobile_nav_trade" />} />
          <TabPane key="info" tab={<FormattedMessage id="mobile_nav_info" />} />
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps({ mobile, market, utils }) {
  let currentTrade = {
    price: 0,
    type: 'buy',
  };
  if (market.trades && market.trades.length > 0) {
    currentTrade = market.trades[0];
  }
  const current = market.current;
  return {
    loading: !current || utils.loading.market,
    currentTrade,
    current,
    isMobile: mobile.isMobile,
    showPart: mobile.showPart,
    basicInfo: market.currentBasicInfo,
    quoteUnitUsdtPrice: market.quoteUnitUsdtPrice,
    usdtRate: market.usdtRate,
  };
}

export default connect(mapStateToProps)(MobileNav);
