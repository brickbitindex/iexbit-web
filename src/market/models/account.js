/* eslint no-confusing-arrow: 0 */

import QUERY, { fetch } from './querys';

const deleteOrder = id => fetch.delete(QUERY.DELETE_ORDER(id)).catch(err => err);

const model = {
  namespace: 'account',
  state: {
    balance: [],
    orders: [],
  },
  subscriptions: {
    // TODO:
    // setup({ dispatch }) {
    //   dispatch({
    //     type: 'updateBalance',
    //     payload: data.balance,
    //   });
    // },
  },
  effects: {
    * deleteOrder({ payload }, { call }) {
      const id = payload.id;
      const response = yield call(deleteOrder, id);
      console.log(response);
    },
  },
  reducers: {
    updateBalance(state, { payload }) {
      const balance = [...state.balance];
      const currencyArr = balance.filter(b => b.currency === payload.currency);
      if (currencyArr.length === 0) {
        balance.push(payload);
      } else {
        balance.splice(balance.indexOf(currencyArr[0]), 1, payload);
      }
      balance.sort((a, b) => a.currency > b.currency ? 1 : -1);
      return {
        ...state,
        balance,
      };
    },
    updateOrders(state, { payload }) {
      const orders = [...state.orders];
      console.log(payload);
      const idArr = orders.filter(b => b.id === payload.id);
      if (idArr.length === 0) {
        orders.push(payload);
      } else {
        orders.splice(orders.indexOf(idArr[0]), 1, payload);
      }
      orders.sort((a, b) => b.id - a.id);
      return {
        ...state,
        orders,
      };
    },
  },
};

export default model;
