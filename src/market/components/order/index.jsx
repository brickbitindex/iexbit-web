import React from 'react';
import { connect } from 'dva';
// import { FormattedMessage } from 'react-intl';
import Order from './order';
import wrapWithPanel from '../panel';

import './style.scss';

function WrapBuyOrder(props) {
  return (
    <Order
      type="buy"
      {...props}
      onSubmit={() => {
        props.dispatch({ type: 'order/submitBidOrder' });
      }}
      onPriceChange={(e) => {
        props.dispatch({
          type: 'order/updateBidPrice',
          payload: e.target.value,
        });
      }}
      onAmountChange={(e) => {
        props.dispatch({
          type: 'order/updateBidAmount',
          payload: e.target.value,
        });
      }}
      onTypeChange={(option) => {
        props.dispatch({
          type: 'order/updateBidType',
          payload: option,
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
      onSubmit={() => {
        props.dispatch({ type: 'order/submitAskOrder' });
      }}
      onPriceChange={(e) => {
        props.dispatch({
          type: 'order/updateAskPrice',
          payload: e.target.value,
        });
      }}
      onAmountChange={(e) => {
        props.dispatch({
          type: 'order/updateAskAmount',
          payload: e.target.value,
        });
      }}
      onTypeChange={(option) => {
        props.dispatch({
          type: 'order/updateAskType',
          payload: option,
        });
      }}
    />
  );
}

function mapStateToPropsBuy({ order }) {
  return {
    form: order.bid,
  };
}

function mapStateToPropsSell({ order }) {
  return {
    form: order.ask,
  };
}

const BuyOrder = wrapWithPanel(connect(mapStateToPropsBuy)(WrapBuyOrder), {
  className: 'buy-panel',
});

const SellOrder = wrapWithPanel(connect(mapStateToPropsSell)(WrapSellOrder), {
  className: 'sell-panel',
});

export {
  BuyOrder,
  SellOrder,
};
