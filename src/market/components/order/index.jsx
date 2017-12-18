import React from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import Order from './order';
import wrapWithPanel from '../panel';

import './style.scss';

function WrapBuyOrder(props) {
  return (
    <Order
      type="buy"
      {...props}
      onSubmit={(data) => {
        props.dispatch({
          type: 'market/addOrder',
          payload: {
            type: 'bid',
            data,
          },
        });
      }}
    />
  );
}

function WrapSellOrder(props) {
  return (
    <Order
      type="sell"
      {...props}
      onSubmit={(data) => {
        props.dispatch({
          type: 'market/addOrder',
          payload: {
            type: 'ask',
            data,
          },
        });
      }}
    />
  );
}

function mapStateToProps() {
  return {};
}

const BuyOrder = wrapWithPanel(connect(mapStateToProps)(WrapBuyOrder), {
  title: <FormattedMessage id="order" />,
  className: 'buy-panel',
});

const SellOrder = wrapWithPanel(connect(mapStateToProps)(WrapSellOrder), {
  className: 'sell-panel',
});

export {
  BuyOrder,
  SellOrder,
};
