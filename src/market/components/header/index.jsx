import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { FormattedMessage } from 'react-intl';
import { connect } from 'dva-no-router';
import classnames from 'classnames';
import Search from './search';
import Account from './account';
import ZeroFormattedNumber from '../common/zeroFormattedNumber';
import logoImg from '../../../assets/images/logo_all.svg';

import './style.scss';

const localeMap = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
    };
  }
  handleChangeLocale(locale) {
    this.props.dispatch({
      type: 'i18n/changeLocale',
      payload: locale,
    });
  }
  @autobind
  handleSearchBtnClick() {
    this.setState({
      showSearch: !this.state.showSearch,
    });
  }
  render() {
    const { prices, current, basicInfo, currentTrade, locale } = this.props;
    const currentPrice = currentTrade.price;
    const ticker = current.ticker;
    let change = 0;
    if (ticker) {
      change = (parseFloat(currentPrice) - ticker.open) / ticker.open;
    }
    const down = change < 0;
    const baseUnit = basicInfo.base_unit.code;
    const quoteUnit = basicInfo.quote_unit.code;
    return (
      <div id="header" className="flex-fixed">
        <div className="logo-container flex-fixed">
          <a href={`/${locale.toLowerCase()}`}>
            <img src={logoImg} alt="Bitrabbit" />
          </a>
        </div>
        <div className="market-name flex-autofixed">
          <span className="t1">{baseUnit}</span>
          <span className="t2">&nbsp;/&nbsp;{quoteUnit}</span>
        </div>
        {ticker && [(
          <div key="0" className="market-info flex-autofixed">
            <div className="mt"><FormattedMessage id="market_change" /></div>
            <div className="mv tt">
              <span className={classnames(down ? 'red-text' : 'green-text')}>
                {down ? '-' : '+'}{Math.abs(change * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        ), (
          <div key="1" className="market-info flex-autofixed">
            <div className="mt"><FormattedMessage id="market_low" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={ticker.low} fixed={3} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
        ), (
          <div key="2" className="market-info flex-autofixed">
            <div className="mt"><FormattedMessage id="market_high" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={ticker.high} fixed={3} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
        ), (
          <div key="3" className="market-info flex-autofixed">
            <div className="mt"><FormattedMessage id="market_vol" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={ticker.volume} fixed={3} /> <span className="light-text">{baseUnit}</span></div>
          </div>
        )]}
        <div className="header-opts flex-fixed">
          <span className="header-opts-btn simple-btn" onClick={this.handleSearchBtnClick}>
            <i className="icon anticon icon-search1" />
          </span>
          <Account />
          <span className="header-opts-btn simple-btn" id="localeSelector">
            <span>{localeMap[locale]}</span>
            <div className="header-menu">
              {Object.keys(localeMap).map((k, i) => (
                <div className="menu-item" key={i} onClick={this.handleChangeLocale.bind(this, k)}>{localeMap[k]}</div>
              ))}
            </div>
          </span>
        </div>
        <Search show={this.state.showSearch} prices={prices} onCancel={this.handleSearchBtnClick} />
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
    currentTrade,
    prices: market.prices,
    current: market.current,
    basicInfo: market.currentBasicInfo,
    locale: i18n.locale,
  };
}

export default connect(mapStateToProps)(Header);
