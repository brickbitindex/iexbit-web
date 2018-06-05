import React, { Component } from 'react';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Select from 'react-select';
import Slider from 'rc-slider';
import Decimal from 'decimal.js-light';
import OrderInput from './input';
import OrderButton from './button';
import Tooltip from '../common/tooltip';
import Mask from '../common/anonymousMask';

Decimal.config({ toExpNeg: -16 });
// const createSliderWithTooltip = _Slider.createSliderWithTooltip;
// const Slider = createSliderWithTooltip(_Slider);

const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  if (dragging) {
    return (
      <Handle value={value} {...restProps} >
        <Tooltip text={`${value}%`} key={index} />
      </Handle>
    );
  }
  return <Handle value={value} {...restProps} />;
};

class Order extends Component {
  getBalance() {
    const { type, basicInfo } = this.props;
    const key = type === 'buy' ? basicInfo.quote_unit.code : basicInfo.base_unit.code;
    const { balance } = this.props;
    const keyBalance = balance.filter(b => b.currency_code === key);
    if (keyBalance.length > 0) {
      const balanceText = keyBalance[0].balance;
      const lockedText = keyBalance[0].locked;
      const balancep = parseFloat(balanceText);
      const locked = parseFloat(lockedText);
      return {
        balance: balancep,
        balanceText,
        locked,
        lockedText,
        key,
      };
    }
    return {
      balance: 0,
      balanceText: '0',
      locked: 0,
      lockedText: '0',
      key,
    };
  }
  getSliderValue() {
    const balance = this.getBalance();
    const amount = this.props.form.amount || 0;
    const price = this.props.form.price || 0;
    let percent = 0;
    if (this.props.type === 'buy') {
      if (price) {
        percent = Math.round((amount * price) / balance.balance * 1000) / 10;
      }
    } else {
      percent = Math.round(amount / balance.balance * 1000) / 10;
    }
    if (isNaN(percent)) return 0;
    return percent;
  }
  @autobind
  handleSubmit() {
    const { anonymous } = this.props;
    if (anonymous) return;
    this.props.onSubmit();
  }
  handleQuickAmount(percentage) {
    const balance = this.getBalance();
    const price = this.props.form.price;
    let value;
    const amountFixed = this.props.config.amount_fixed;
    if (this.props.type === 'buy') {
      if (price) {
        const priceFixed = this.props.config.price_fixed;
        const scaledAmount = parseInt(percentage * balance.balance * Math.pow(10, amountFixed), 10);
        const scaledPrice = parseInt(parseFloat(price) * Math.pow(10, priceFixed), 10) * Math.pow(10, amountFixed - priceFixed);
        value = parseInt(scaledAmount / scaledPrice * Math.pow(10, amountFixed), 10) / Math.pow(10, amountFixed);
        this.props.onAmountChange({
          target: {
            value,
          },
        });
      }
    } else {
      value = parseInt(percentage * balance.balance * Math.pow(10, amountFixed), 10) / Math.pow(10, amountFixed);
      this.props.onAmountChange({
        target: {
          value,
        },
      });
    }
  }
  @autobind
  handleSliderChange(e) {
    this.handleQuickAmount(e / 100);
  }
  render() {
    const { basicInfo, anonymous, form } = this.props;
    const error = form.error;
    const balance = this.getBalance();
    const sliderValue = this.getSliderValue();
    const marketValue = form.price && form.amount ? new Decimal(parseFloat(form.price * form.amount)).toString() : undefined;
    return (
      <div className="order">
        <div className="order-balance">
          <div className="flex-fixed">{balance.key}<FormattedMessage id="order_balance" /></div>
          <div className="order-balance-value flex-autofixed"><FormattedNumber value={balance.balanceText} maximumFractionDigits={8} /></div>
        </div>
        <div className="order-row">
          <div className="order-lable"><FormattedMessage id="order_type" /></div>
          <Select
            className={classnames('cb-select order-item', { error: error.type })}
            searchable={false}
            clearable={false}
            placeholder=""
            value={form.type}
            onChange={this.props.onTypeChange}
            options={form.types}
          />
        </div>
        <div className="order-row">
          <div className="order-lable"><FormattedMessage id="order_price" /></div>
          <OrderInput
            className={classnames('order-item', { error: error.price })}
            value={form.price}
            onChange={this.props.onPriceChange}
            suffix={basicInfo.quote_unit.code}
          />
        </div>
        <div className="order-row">
          <div className="order-lable"><FormattedMessage id="order_amount" /></div>
          <OrderInput
            className={classnames('order-item', { error: error.amount })}
            value={form.amount}
            onChange={this.props.onAmountChange}
            suffix={basicInfo.base_unit.code}
          />
        </div>
        <div className="order-row-trade">
          <div className="order-label">
            <FormattedMessage id="order_budget_sell" />
          </div>
          {marketValue && <span className="order-item tt">
            {marketValue} {balance.key}
          </span>}
        </div>
        <div className="order-row small">
          <Slider step={0.1} value={sliderValue} handle={handle} onChange={this.handleSliderChange} />
        </div>
        {/* <div className="order-row small">
          <div className="order-lable">{''}</div>
          <div className="order-item order-amount-btns">
            <span className="order-amount-btn" onClick={this.handleQuickAmount.bind(this, 0.25)}>25%</span>
            <span className="order-amount-btn" onClick={this.handleQuickAmount.bind(this, 0.5)}>50%</span>
            <span className="order-amount-btn" onClick={this.handleQuickAmount.bind(this, 0.75)}>75%</span>
            <span className="order-amount-btn" onClick={this.handleQuickAmount.bind(this, 1)}>100%</span>
          </div>
        </div> */}
        <div className="order-row">
          <OrderButton className={this.props.type} onClick={this.handleSubmit}>
            <FormattedMessage id={`order_${this.props.type}`} />
            <span> {basicInfo.base_unit.code}</span>
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
    basicInfo: market.currentBasicInfo,
    balance: account.balance,
    anonymous: account.anonymous,
  };
}

export default connect(mapStateToProps)(Order);
