/* eslint no-confusing-arrow: 0 */

import QUERY, { fetch } from './querys';
import { message } from '../lib/antd';

const deleteOrder = (id, type) => fetch.delete(QUERY.DELETE_ORDER(id, type)).catch(err => err);
const queryHistoryLog = (payload, options) => fetch.get(QUERY.TRADES, payload, options).catch(err => err);
const clearOrders = payload => fetch.post(QUERY.CLEAR_ORDERS, payload).catch(err => err);

const marketId = window.document.body.dataset.market_id;
const locale = window.locale;

const model = {
  namespace: 'account',
  state: {
    balance: [],
    orders: [],
    anonymous: !window.gon.current_user,
    currentUser: {},
    historyLogs: [],
    historyPage: {
      total: 1,
      total_pages: 1,
    },
    page: 1,
    count: 20,
  },
  subscriptions: {
    setup({ dispatch }) {
      if (window.gon.current_user) {
        dispatch({
          type: 'updateState',
          payload: {
            currentUser: window.gon.current_user,
          },
        });
      }
    },
  },
  effects: {
    * clearOrders({ payload }, { call }) {
      const data = yield call(clearOrders, payload);
      if (data.success) message.success('myorder_cancel_success');
    },
    * deleteOrder({ payload }, { call }) {
      const response = yield call(deleteOrder, payload.id, payload.kind);
      if (response.ok) {
        message.info('text_order_delete');
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
          message.info('text_order_done');
          yield put({
            type: 'utils/pushMessage',
            payload: {
              message: `messagecenter_order_${p.kind}_done`,
              from: 'trade',
              level: 'info',
              data: {
                price: p.price,
                amount: p.origin_volume,
                quote_unit: currentBasicInfo.quote_unit.code,
                base_unit: currentBasicInfo.base_unit.code,
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
    * queryHistoryLog({ payload }, { select, call, put }) {
      const page = yield select(({ account }) => account.page);
      const count = yield select(({ account }) => account.count);
      const options = {
        credentials: 'include',
      };
      const data = yield call(queryHistoryLog, { page, count, locale, market_id: marketId, ...payload }, options);
      if (data.success) {
        const history = data.data;
        if (history) {
          yield put({
            type: 'updateState',
            payload: {
              historyLogs: history.trades,
              historyPage: {
                total: history.total_pages * count || 1,
                total_pages: history.total_pages,
              },
              page,
            },
          });
        }
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
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default model;
