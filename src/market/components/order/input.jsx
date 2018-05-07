import React from 'react';
import classnames from 'classnames';
import './input.scss';

export default function OrderInput(props) {
  const value = props.value || '';
  return (
    <div className={classnames('order-input', props.className)}>
      <input className="tt" type="text" value={value} onChange={props.onChange} />
      {props.suffix && (
        <span className="order-input-suffix light-text">{props.suffix}</span>
      )}
    </div>
  );
}

