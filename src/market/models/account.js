/* eslint no-confusing-arrow: 0 */

import QUERY, { fetch } from './querys';
import toast from '../components/common/toast';

const deleteOrder = (id, type) => fetch.delete(QUERY.DELETE_ORDER(id, type)).catch(err => err);

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
      const response = yield call(deleteOrder, payload.id, payload.kind);
      if (response.ok) {
        toast.info('text_order_delete');
      }
    },
  },
  reducers: {
    updateBalance(state, { payload }) {
      const balance = [...state.balance];
      const currencyArr = balance.filter(b => b.currency_code === payload.currency_code);
      if (currencyArr.length === 0) {
        balance.push(payload);
      } else {
        balance.splice(balance.indexOf(currencyArr[0]), 1, payload);
      }
      balance.sort((a, b) => a.currency_code > b.currency_code ? 1 : -1);
      return {
        ...state,
        balance,
      };
    },
    updateOrders(state, { payload }) {
      const orders = [...state.orders];
      // console.log(payload);
      payload.forEach((p) => {
        const idArr = orders.filter(b => b.id === p.id);
        if (idArr.length === 0) {
          orders.push(p);
        } else {
          orders.splice(orders.indexOf(idArr[0]), 1, p);
        }
      });
      orders.sort((a, b) => b.id - a.id);
      return {
        ...state,
        orders,
      };
    },
  },
};

export default model;
