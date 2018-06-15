import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { Input } from '../../lib/antd';
import './input.scss';

const reg = /^[0-9.]+$/;

export default class OrderInput extends Component {
  @autobind
  handleChange(e) {
    if (e.target.value.length > 0 && !(reg.test(e.target.value))) {
      return;
    }
    this.props.onChange(e);
  }
  render() {
    const { className, suffix } = this.props;
    const value = this.props.value || '';
    return (
      <div className={classnames('order-input', className)}>
        <Input className="tt" value={value} onChange={this.handleChange} />
        {suffix && (
          <span className="order-input-suffix light-text">{suffix}</span>
        )}
      </div>
    );
  }
}
