import React, { Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
// import autobind from 'autobind-decorator';
import { FormattedMessage } from 'react-intl';

import './account.scss';

function redirect(open) {
  window.location = `/?open=${open}&redirect_to=${encodeURIComponent(window.location.pathname + window.location.hash)}`;
}

class Account extends Component {
  render() {
    const { anonymous, currentUser } = this.props;
    return (
      <div id="account" className={classnames({ anonymous })}>
        {anonymous ? (
          <span className="header-opts-btn" onClick={this.handleSearchBtnClick}>
            <a onClick={() => redirect('signin')}><FormattedMessage id="anonymous_signin" /></a>
            <FormattedMessage id="anonymous_or" />
            <a onClick={() => redirect('signup')}><FormattedMessage id="anonymous_signup" /></a>
          </span>
        ) : (
          <span className="header-opts-btn simple-btn" onClick={this.handleSearchBtnClick}>
            <i className="icon anticon icon-user" />
            <div className="header-menu">
              <div className="menu-item" onClick={() => window.open('/dashboard')}>
                <div className="t1"><FormattedMessage id="header_dashborad" /></div>
                <div>{currentUser.email}</div>
              </div>
              <div className="menu-item" onClick={() => window.location = '/signout'}>
                <FormattedMessage id="header_logout" /><i className="icon anticon icon-logout" />
              </div>
            </div>
          </span>
        )}
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return {
    anonymous: account.anonymous,
    currentUser: account.currentUser,
  };
}

export default connect(mapStateToProps)(Account);
