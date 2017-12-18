import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';

import OrderInput from './input';
import OrderButton from './button';

const numberReg = /^\d+(\.\d+)?$/;

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: undefined,
      price: undefined,
      amount: undefined,
      error: {
        type: false,
        price: false,
        amount: false,
      },
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
    if (!this.formError()) {
      this.props.onSubmit({
        type: type.value,
        price,
        amount,
      });
    }
  }
  render() {
    const { type, price, amount, error } = this.state;
    return (
      <div className="order">
        <div className="order-row">
          <div className="order-lable"><FormattedMessage id="order_type" /></div>
          <Select
            className={classnames('cb-select order-item', { error: error.type })}
            searchable={false}
            clearable={false}
            placeholder=""
            value={type}
            onChange={this.handleTypeChange}
            options={[
              { value: 'limit', label: <FormattedMessage id="order_type_limit" /> },
              { value: 'market', label: <FormattedMessage id="order_type_market" /> },
            ]}
          />
        </div>
        <div className="order-row">
          <div className="order-lable"><FormattedMessage id="order_price" /></div>
          <OrderInput
            className={classnames('order-item', { error: error.price })}
            value={price}
            onChange={this.handlePriceChange}
          />
        </div>
        <div className="order-row">
          <div className="order-lable"><FormattedMessage id="order_amount" /></div>
          <OrderInput
            className={classnames('order-item', { error: error.amount })}
            value={amount}
            onChange={this.handleAmountChange}
          />
        </div>
        <div className="order-row">
          <OrderButton className={this.props.type} onClick={this.handleSubmit}>
            {this.props.type === 'buy' ? (
              <FormattedMessage id="order_buy" />
            ) : (
              <FormattedMessage id="order_sell" />
            )}
          </OrderButton>
        </div>
      </div>
    );
  }
}
