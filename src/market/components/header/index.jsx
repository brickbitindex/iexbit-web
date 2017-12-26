import React, { Component } from 'react';
// import { FormattedMessage, FormattedRelative } from 'react-intl';
import { connect } from 'dva-no-router';
import Price from './price';

import logoImg from '../../../assets/images/logo_all.svg';

import './style.scss';

class Header extends Component {
  render() {
    const { prices } = this.props;
    return (
      <div id="header" className="flex-fixed">
        <div className="logo-container">
          <a><img src={logoImg} alt="Cool.Bi" /></a>
        </div>
        {prices.slice(0, 4).map((price, i) => (<Price key={i} data={price} />))}
        <div className="header-opts">
          <span className="header-search simple-btn">
            <i className="icon anticon icon-search1" />
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ market }) {
  return { prices: market.prices };
}

export default connect(mapStateToProps)(Header);
