import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { FormattedMessage } from 'react-intl';
import { connect } from 'dva-no-router';
import classnames from 'classnames';
import Search from './search';
import Account from './account';
import { Dropdown, Menu, Icon, Modal } from '../../lib/antd';
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
  @autobind
  handleChangeLocale(locale) {
    this.props.dispatch({
      type: 'i18n/changeLocale',
      payload: locale.key,
    });
  }
  @autobind
  handleSearchBtnClick() {
    this.setState({
      showSearch: !this.state.showSearch,
    });
  }
  render() {
    const { prices, current, basicInfo, locale, anonymous } = this.props;
    const baseUnit = basicInfo.base_unit.code;
    const quoteUnit = basicInfo.quote_unit.code;

    const menu = (<Menu onClick={this.handleChangeLocale} className="header-menu">
      {
        Object.keys(localeMap).map(k => (
          <Menu.Item className="menu-item" key={k}>{localeMap[k]}</Menu.Item>
        ))
      }
    </Menu>);
    return (
      <div id="header" className="flex-fixed">
        <div className="logo-container flex-fixed">
          <a href={`/${locale.toLowerCase()}`}>
            <img src={logoImg} alt="Bitrabbit" />
          </a>
        </div>
        <div className="market-name flex-autofixed" onClick={this.handleSearchBtnClick}>
          <span className="header-opt-trades">
            <span className="t1">{baseUnit}</span>
            <span className="t2">&nbsp;/&nbsp;{quoteUnit}</span>
          </span>
          <span className="header-opts-btn search-btn">
            <Icon type="search" />
          </span>
        </div>
        {current && [(
          <div key="0" className="market-info flex-autofixed">
            <div className="mt"><FormattedMessage id="market_change" /></div>
            <div className="mv tt">
              <span className={classnames(current.down ? 'red-text' : 'green-text')}>
                {current.down ? '-' : '+'}{Math.abs(current.change * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        ), (
          <div key="1" className="market-info flex-autofixed">
            <div className="mt"><FormattedMessage id="market_low" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={current.low} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
        ), (
          <div key="2" className="market-info flex-autofixed">
            <div className="mt"><FormattedMessage id="market_high" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={current.high} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
        ), (
          <div key="3" className="market-info flex-autofixed">
            <div className="mt"><FormattedMessage id="market_vol" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={current.volume} /> <span className="light-text">{baseUnit}</span></div>
          </div>
        )]}
        <div className="header-opts flex-fixed">
          {!anonymous && (
            <span className="header-opts-btn simple-btn">
              <a target="_blank" className="header-assets" href="/dashboard/#/assets" rel="noopener noreferrer"><FormattedMessage id="header_assets" /></a>
            </span>
          )}
          <Account />
          <Dropdown overlay={menu} placement="bottomRight">
            <span className="header-opts-btn simple-btn" id="localeSelector">
              <a className="header-locale">{localeMap[locale]}</a>
            </span>
          </Dropdown>
        </div>
        {/* <Search show={this.state.showSearch} prices={prices} onCancel={this.handleSearchBtnClick} /> */}
        <Modal
          visible={this.state.showSearch}
          onCancel={this.handleSearchBtnClick}
          footer={null}
          width="708px"
        >
          <Search prices={prices} />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ market, i18n, account }) {
  let currentTrade = {
    price: 0,
    type: 'buy',
  };
  if (market.trades && market.trades.length > 0) {
    currentTrade = market.trades[0];
  }
  return {
    anonymous: account.anonymous,
    currentTrade,
    prices: market.prices,
    current: market.current,
    basicInfo: market.currentBasicInfo,
    locale: i18n.locale,
  };
}

export default connect(mapStateToProps)(Header);
