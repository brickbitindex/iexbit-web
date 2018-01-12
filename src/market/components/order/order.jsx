import React, { Component } from 'react';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';

import OrderInput from './input';
import OrderButton from './button';
import Mask from '../common/anonymousMask';

const numberReg = /^\d+(\.\d+)?$/;

const typeOptions = [
  { value: 'limit', label: <FormattedMessage id="order_type_limit" /> },
  { value: 'market', label: <FormattedMessage id="order_type_market" /> },
];

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: typeOptions[0],
      price: undefined,
      amount: undefined,
      error: {
        type: false,
        price: false,
        amount: false,
      },
    };
  }
  getBalance(key) {
    const { balance } = this.props;
    const keyBalance = balance.filter(b => b.currency_code === key);
    if (keyBalance.length > 0) {
      const balancep = parseFloat(keyBalance[0].balance);
      const locked = parseFloat(keyBalance[0].locked);
      return {
        balance: balancep,
        locked,
      };
    }
    return {
      balance: 0,
      locked: 0,
    };
  }
  @autobind
  handleTypeChange(selectedOption) {
    const error = { ...this.state.error };
    error.type = !selectedOption;
    this.setState({
      type: selectedOption,
      error,
    });
  }
  @autobind
  handlePriceChange(e) {
    const value = e.target.value;
    const error = { ...this.state.error };
    error.price = !(numberReg.test(value));
    this.setState({
      price: value,
      error,
    });
  }
  @autobind
  handleAmountChange(e) {
    const value = e.target.value;
    const error = { ...this.state.error };
    error.amount = !(numberReg.test(value));
    this.setState({
      amount: value,
      error,
    });
  }
  formError() {
    const { type, price, amount } = this.state;
    const error = {
      type: false,
      price: false,
      amount: false,
    };
    let ret = false;
    if (type === undefined) {
      error.type = true;
      ret = true;
    }
    if (!(price && price.length > 0 && numberReg.test(price))) {
      error.price = true;
      ret = true;
    }
    if (!(amount && amount.length > 0 && numberReg.test(amount))) {
      error.amount = true;
      ret = true;
    }
    this.setState({
      error,
    });
    return ret;
  }
  @autobind
  handleSubmit() {
    const { type, price, amount } = this.state;
    const { anonymous } = this.props;
    if (anonymous) return;
    if (!this.formError()) {
      this.props.onSubmit({
        type: type.value,
        price,
        amount,
      });
    }
  }
  handleQuickAmount(percentage) {
    const { marketBasicInfo } = this.props;
    const key = this.props.type === 'buy' ? marketBasicInfo.quote_unit : marketBasicInfo.base_unit;
    const balance = this.getBalance(key);
    const current = balance.balance - balance.locked;
    this.setState({
      amount: percentage * current,
    });
  }
  // TODO: balance.toFixed
  render() {
    const { type, price, amount, error } = this.state;
    const { marketBasicInfo, anonymous } = this.props;
    const key = this.props.type === 'buy' ? marketBasicInfo.quote_unit : marketBasicInfo.base_unit;
    const balance = this.getBalance(key);
    return (
      <div className="order">
        <div className="order-balance">
          <div className="flex-fixed">{key.toUpperCase()}<FormattedMessage id="order_balance" /></div>
          <div className="order-balance-value flex-autofixed">{balance.balance.toFixed(2)}</div>
        </div>
        <div className="order-row">
          <div className="order-lable"><FormattedMessage id="order_type" /></div>
          <Select
            className={classnames('cb-select order-item', { error: error.type })}
            searchable={false}
            clearable={false}
            placeholder=""
            value={type}
            onChange={this.handleTypeChange}
            options={typeOptions}
          />
        </div>
        <div className="order-row">
          <div className="order-lable"><FormattedMessage id="order_price" /></div>
          <OrderInput
            className={classnames('order-item', { error: error.price })}
            value={price}
            onChange={this.handlePriceChange}
            suffix={marketBasicInfo.quote_unit.toUpperCase()}
          />
        </div>
        <div className="order-row">
          <div className="order-lable"><FormattedMessage id="order_amount" /></div>
          <OrderInput
            className={classnames('order-item', { error: error.amount })}
            value={amount}
            onChange={this.handleAmountChange}
            suffix={marketBasicInfo.base_unit.toUpperCase()}
          />
        </div>
        <div className="order-row small">
          <div className="order-lable">{''}</div>
          <div className="order-item order-amount-btns">
            <span className="order-amount-btn" onClick={this.handleQuickAmount.bind(this, 0.25)}>25%</span>
            <span className="order-amount-btn" onClick={this.handleQuickAmount.bind(this, 0.5)}>50%</span>
            <span className="order-amount-btn" onClick={this.handleQuickAmount.bind(this, 0.75)}>75%</span>
            <span className="order-amount-btn" onClick={this.handleQuickAmount.bind(this, 1)}>100%</span>
          </div>
        </div>
        <div className="order-row">
          <OrderButton className={this.props.type} onClick={this.handleSubmit}>
            <FormattedMessage id={`order_${this.props.type}`} />
            <span>{marketBasicInfo.base_unit.toUpperCase()}</span>
          </OrderButton>
        </div>
        {anonymous && (
          <Mask />
        )}
      </div>
    );
  }
}

function mapStateToProps({ market, account }) {
  return {
    marketBasicInfo: market.currentBasicInfo,
    balance: account.balance,
    anonymous: account.anonymous,
  };
}

export default connect(mapStateToProps)(Order);
