import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import Price from './price';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
    };
    this.$dom = null;
    this.$input = null;
  }
  componentWillReceiveProps(props) {
    if (props.show) {
      setTimeout(() => {
        this.$input.focus();
      }, 100);
    }
  }
  @autobind
  handleMaskClick(e) {
    if (e.target === this.$dom) {
      this.props.onCancel();
    }
  }
  @autobind
  handleInputChange(e) {
    this.setState({
      filter: e.target.value,
    });
  }
  render() {
    const { prices, show } = this.props;
    const { filter } = this.state;
    let _prices = prices;
    let reg;
    if (filter.length > 0) {
      reg = new RegExp(filter, 'i');
      _prices = prices.filter(p => p.name.match(reg));
    }
    return (
      <div id="search" style={{ display: show ? 'flex' : 'none' }} onClick={this.handleMaskClick} ref={e => this.$dom = e}>
        <div className="search-area">
          <div className="search-input">
            <input type="text" ref={e => this.$input = e} onChange={this.handleInputChange} value={this.state.filter} />
          </div>
          <div className="search-prices">
            {_prices.map((price, i) => (<Price key={i} data={price} highlightReg={reg} />))}
          </div>
        </div>
      </div>
    );
  }
}

