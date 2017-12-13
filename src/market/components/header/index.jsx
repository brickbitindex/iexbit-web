import React, { Component } from 'react';
// import { FormattedMessage, FormattedRelative } from 'react-intl';
import { connect } from 'dva-no-router';
import classnames from 'classnames';

import logoImg from '../../../assets/images/logo_all.svg';

import './style.scss';

class Header extends Component {
  render() {
    const { prices } = this.props;
    console.log(prices);
    return (
      <div id="header">
        <div className="logo-container">
          <a><img src={logoImg} alt="Cool.Bi" /></a>
        </div>
        {prices.slice(0, 4).map((price, i) => {
          const down = price.change < 0;
          return (
            <div className="header-price" key={i}>
              <div className="header-price-name">{price.name}</div>
              <div className="header-price-current">
                <span>{price.current.toFixed(price.fix)} {price.unit}</span>
                <span>&nbsp;</span>
                <span className={classnames(down ? 'green-text' : 'red-text')}>
                  ({down ? '-' : '+'}{Math.abs(price.change * 100).toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps({ market }) {
  return { prices: market.prices };
}

export default connect(mapStateToProps)(Header);
