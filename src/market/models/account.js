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
    * updateOrders({ payload }, { select, put }) {
      let orders = yield select(({ account }) => account.orders);
      orders = [...orders];
      for (let i = 0; i < payload.length; i += 1) {
        const p = payload[i];
        const idArr = orders.filter(b => b.id === p.id);
        if (idArr.length === 0) {
          // 未在当前列表中找到
          if (p.state === 'wait') {
            orders.push(p);
          }
        } else if (p.state === 'wait') {
          // 找到了，更新
          orders.splice(orders.indexOf(idArr[0]), 1, p);
        } else if (p.state === 'cancel') {
          // 取消了订单
          orders.splice(orders.indexOf(idArr[0]), 1);
        } else if (p.state === 'done') {
          // 订单成交
          orders.splice(orders.indexOf(idArr[0]), 1);
          const currentBasicInfo = yield select(({ market }) => market.currentBasicInfo);
          toast.info('text_order_done');
          yield put({
            type: 'utils/pushMessage',
            payload: {
              message: `messagecenter_order_${p.kind}_done`,
              from: 'trade',
              level: 'info',
              data: {
                price: p.price,
                amount: p.origin_volume,
                quote_unit: currentBasicInfo.quote_unit,
                base_unit: currentBasicInfo.base_unit,
              },
            },
          });
        }
      }
      orders.sort((a, b) => b.id - a.id);
      yield put({
        type: 'updateState',
        payload: {
          orders,
        },
      });
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
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default model;
