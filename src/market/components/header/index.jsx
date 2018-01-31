import React, { Component } from 'react';
import autobind from 'autobind-decorator';
// import { FormattedMessage, FormattedRelative } from 'react-intl';
import { connect } from 'dva-no-router';
import Price from './price';
import Search from './search';

// import logoImg from '../../../assets/images/logo_all.svg';

import './style.scss';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
    };
  }
  @autobind
  handleSearchBtnClick() {
    this.setState({
      showSearch: !this.state.showSearch,
    });
  }
  render() {
    const { prices } = this.props;
    return (
      <div id="header" className="flex-fixed">
        <div className="logo-container">
          <a><img src="/logo.svg" alt="Cool.Bi" /></a>
        </div>
        {prices.slice(0, 4).map((price, i) => (<Price key={i} data={price} />))}
        <div className="header-opts">
          <span className="header-search simple-btn" onClick={this.handleSearchBtnClick}>
            <i className="icon anticon icon-search1" />
          </span>
        </div>
        <Search show={this.state.showSearch} prices={prices} onCancel={this.handleSearchBtnClick} />
      </div>
    );
  }
}

function mapStateToProps({ market }) {
  return { prices: market.prices };
}

export default connect(mapStateToProps)(Header);
