import React from 'react';
import classnames from 'classnames';
import './button.scss';

export default function OrderButton(props) {
  return (
    <button className={classnames('order-btn', props.className)} disabled={props.disabled} onClick={props.onClick}>{props.children}</button>
  );
}
