import React, { Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import autobind from 'autobind-decorator';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown } from '../../lib/antd';

import './account.scss';

function redirect(open) {
  window.location = `/?open=${open}&redirect_to=${encodeURIComponent(window.location.pathname + window.location.hash)}`;
}

class Account extends Component {
  @autobind
  handleChangeMenu(e) {
    const { locale } = this.props;
    console.log(locale);
    const lowerLocale = locale === 'en' ? 'en-us' : locale.toLowerCase();
    switch (e.key) {
      case 'articles':
        window.open(`https://support.bitrabbit.com/hc/${lowerLocale}`);
        break;
      case 'help':
        window.open(`https://support.bitrabbit.com/hc/${lowerLocale}/requests/new`);
        break;
      case 'logout':
        window.location = '/signout';
        break;
      default:
        window.open(`/dashboard/#/${e.key}`);
        break;
    }
  }
  render() {
    const { anonymous, currentUser } = this.props;
    const menu = (
      <Menu className="header-menu" onClick={this.handleChangeMenu}>
        <Menu.Item key="account" className="menu-item">
          <div className="t1"><FormattedMessage id="header_dashborad" /></div>
          <div>{currentUser.email}</div>
        </Menu.Item>
        <Menu.Item key="markets" className="menu-item">
          <FormattedMessage id="header_menu_markets" />
        </Menu.Item>
        <Menu.Item key="history" className="menu-item">
          <FormattedMessage id="header_menu_history" />
        </Menu.Item>
        <Menu.Item key="articles" className="menu-item">
          <FormattedMessage id="header_menu_articles" />
        </Menu.Item>
        <Menu.Item key="help" className="menu-item">
          <FormattedMessage id="header_menu_help" />
        </Menu.Item>
        <Menu.Item key="logout" className="menu-item">
          <FormattedMessage id="header_logout" /> <i className="icon anticon icon-logout" />
        </Menu.Item>
      </Menu>
    );
    return (
      <div id="account" className={classnames({ anonymous })}>
        {anonymous ? (
          <span className="header-opts-btn">
            <a onClick={() => redirect('signin')}><FormattedMessage id="anonymous_signin" /></a>
            <FormattedMessage id="anonymous_or" />
            <a onClick={() => redirect('signup')}><FormattedMessage id="anonymous_signup" /></a>
          </span>
        ) : (
          <Dropdown className="header-opts-btn simple-btn" overlay={menu}>
            <i className="icon anticon icon-user" />
          </Dropdown>
        )}
      </div>
    );
  }
}

function mapStateToProps({ account, i18n }) {
  return {
    anonymous: account.anonymous,
    currentUser: account.currentUser,
    locale: i18n.locale,
  };
}

export default connect(mapStateToProps)(Account);
