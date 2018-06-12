import React from 'react';
import classnames from 'classnames';
import { Button } from '../../lib/antd';
import './button.scss';

export default function OrderButton(props) {
  return (
    <Button className={classnames('order-btn', props.className)} disabled={props.disabled} onClick={props.onClick}>{props.children}</Button>
  );
}
