import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getDecimalCount } from '../lib/utils';

// const typeOptions = [
//   { value: 'limit', label: <FormattedMessage id="order_type_limit" /> },
//   { value: 'market', label: <FormattedMessage id="order_type_market" /> },
// ];
const typeOptions = ['limit', 'market'];

const numberReg = /^\d+(\.\d+)?$/;

function checkFormError(form) {
  const { type, price, amount } = form;
  const error = {
    type: false,
    price: false,
    amount: false,
  };
  let result = false;
  if (type === undefined) {
    error.type = true;
    result = true;
  }
  if (type === 'limit') {
    if (!(price && price !== '' && numberReg.test(price))) {
      error.price = true;
      result = true;
    }
  }
  if (!(amount && amount !== '' && numberReg.test(amount))) {
    error.amount = true;
    result = true;
  }
  return {
    error,
    result,
  };
}

const model = {
  namespace: 'order',
  state: {
    bid: {
      types: typeOptions,
      type: typeOptions[0],
      price: undefined,
      amount: undefined,
      error: {
        type: false,
        price: false,
        amount: false,
      },
    },
    ask: {
      types: typeOptions,
      type: typeOptions[0],
      price: undefined,
      amount: undefined,
      error: {
        type: false,
        price: false,
        amount: false,
      },
    },
  },
  effects: {
    * updateBidPrice({ payload }, { select, put }) {
      const originBid = yield select(({ order }) => order.bid);
      const fixed = yield select(({ market }) => market.currentBasicInfo.bid_config.price_fixed);
      const bid = { ...originBid };
      if (fixed < getDecimalCount(payload)) {
        yield put({ type: 'updateBid', bid });
      } else {
        bid.error.price = !(numberReg.test(payload));
        bid.price = payload;
        yield put({ type: 'updateBid', bid });
      }
    },
    * updateAskPrice({ payload }, { select, put }) {
      const originAsk = yield select(({ order }) => order.ask);
      const fixed = yield select(({ market }) => market.currentBasicInfo.ask_config.price_fixed);
      const ask = { ...originAsk };
      if (fixed < getDecimalCount(payload)) {
        yield put({ type: 'updateAsk', ask });
      } else {
        ask.error.price = !(numberReg.test(payload));
        ask.price = payload;
        yield put({ type: 'updateAsk', ask });
      }
    },
    * updateAllPrice({ payload }, { put }) {
      yield put({ type: 'updateBidPrice', payload });
      yield put({ type: 'updateAskPrice', payload });
    },
    * updateBidAmount({ payload }, { select, put }) {
      const originBid = yield select(({ order }) => order.bid);
      const fixed = yield select(({ market }) => market.currentBasicInfo.bid_config.amount_fixed);
      const bid = { ...originBid };
      if (fixed < getDecimalCount(payload)) {
        yield put({ type: 'updateBid', bid });
      } else {
        bid.error.amount = !(numberReg.test(payload));
        bid.amount = payload;
        yield put({ type: 'updateBid', bid });
      }
    },
    * updateAskAmount({ payload }, { select, put }) {
      const originAsk = yield select(({ order }) => order.ask);
      const fixed = yield select(({ market }) => market.currentBasicInfo.ask_config.amount_fixed);
      const ask = { ...originAsk };
      if (fixed < getDecimalCount(payload)) {
        yield put({ type: 'updateAsk', ask });
      } else {
        ask.error.amount = !(numberReg.test(payload));
        ask.amount = payload;
        yield put({ type: 'updateAsk', ask });
      }
    },
    * updateBidType({ payload }, { select, put }) {
      const originBid = yield select(({ order }) => order.bid);
      const bid = { ...originBid };
      bid.error.type = !payload;
      bid.type = payload;
      yield put({ type: 'updateBid', bid });
    },
    * updateAskType({ payload }, { select, put }) {
      const originAsk = yield select(({ order }) => order.ask);
      const ask = { ...originAsk };
      ask.error.type = !payload;
      ask.type = payload;
      yield put({ type: 'updateAsk', ask });
    },
    * submitBidOrder(_, { select, put }) {
      const originBid = yield select(({ order }) => order.bid);
      const check = checkFormError(originBid);
      if (check.result) {
        const bid = { ...originBid };
        bid.error = check.error;
        yield put({ type: 'updateBid', bid });
      } else {
        yield put({
          type: 'market/addOrder',
          payload: {
            type: 'bid',
            data: {
              type: originBid.type,
              price: originBid.price,
              amount: originBid.amount,
            },
          },
        });
        const bid = { ...originBid };
        bid.amount = undefined;
        bid.price = undefined;
        yield put({
          type: 'updateBid',
          bid,
        });
      }
    },
    * submitAskOrder(_, { select, put }) {
      const originAsk = yield select(({ order }) => order.ask);
      const check = checkFormError(originAsk);
      if (check.result) {
        const ask = { ...originAsk };
        ask.error = check.error;
        yield put({ type: 'updateAsk', ask });
      } else {
        yield put({
          type: 'market/addOrder',
          payload: {
            type: 'ask',
            data: {
              type: originAsk.type,
              price: originAsk.price,
              amount: originAsk.amount,
            },
          },
        });
        const ask = { ...originAsk };
        ask.amount = undefined;
        ask.price = undefined;
        yield put({
          type: 'updateAsk',
          ask,
        });
      }
    },
  },
  reducers: {
    updateBid(state, { bid }) {
      return { ...state,
        bid,
      };
    },
    updateAsk(state, { ask }) {
      return { ...state,
        ask,
      };
    },
  },
};

export default model;
