import React from 'react';
import classnames from 'classnames';
import './input.scss';

export default function OrderInput(props) {
  return (
    <div className={classnames('order-input', props.className)}>
      <input className="tt" type="text" value={props.value} onChange={props.onChange} />
      {props.suffix && (
        <span className="order-input-suffix light-text">{props.suffix}</span>
      )}
    </div>
  );
}

