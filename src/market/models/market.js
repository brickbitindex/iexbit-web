/**
 * Data Structure
 * prices: [{
 *   name: 'BTC/ETH',
 *   current: 0.32522334612,
 *   unit: 'ETH',
 *   low: 0.273295272,
 *   high: 0.35235235,
 *   vol: 3252.1,
 *   change: 0.2352,
 *   fix: 5,
 * }]
 */

import QUERY, { fetch } from './querys';

const addBidOrder = data => fetch.post(QUERY.ADD_BID_ORDER, data).catch(err => err);
const addAskOrder = data => fetch.post(QUERY.ADD_ASK_ORDER, data).catch(err => err);

const model = {
  namespace: 'market',
  state: {
    id: '',
    pair: '',
    pairSymbol: '',
    prices: [],
    current: {},
    currentBasicInfo: undefined,
    trades: [],
    orderBook: {
      asks: [],
      bids: [],
    },
  },
  subscriptions: {
    // TODO:
    setup({ dispatch }) {
      const pair = document.body.getAttribute('data-market') || '';
      const id = document.body.getAttribute('data-market_id') || '';
      const pairSymbol = pair.toLowerCase().replace('/', '_');

      dispatch({
        type: 'updateState',
        payload: {
          id,
          pair,
          pairSymbol,
        },
      });
    },
  },
  effects: {
    * addOrder({ payload }, { call }) {
      const data = payload.data;
      let params;
      let caller;
      if (payload.type === 'bid') {
        params = {
          order_bid: {
            ord_type: data.type,
            price: data.price,
            origin_volume: data.amount,
            total: (parseFloat(data.price) * parseFloat(data.amount)).toFixed(2),
          },
        };
        caller = addBidOrder;
      } else {
        params = {
          order_ask: {
            ord_type: data.type,
            price: data.price,
            origin_volume: data.amount,
            total: (parseFloat(data.price) * parseFloat(data.amount)).toFixed(2),
          },
        };
        caller = addAskOrder;
      }
      const response = yield call(caller, params);
      console.log(response);
    },
  },
  reducers: {
    updatePrices(state, { payload }) {
      // 处理数据
      // 结构
      // {"btccny":{"name":"BTC/CNY","base_unit":"btc","quote_unit":"cny","low":"11214.0","high":"57000.0","last":"11214.0","open":19000,"volume":"131.1168","sell":"12002.0","buy":"11213.0","at":1513409205}}
      const currentPair = state.pair;
      let current;
      const prices = Object.keys(payload).map((key) => {
        const pair = payload[key];
        if (pair.name === currentPair) {
          current = pair;
        }
        return pair;
      });
      let currentBasicInfo = state.currentBasicInfo;
      if (!state.currentBasicInfo) {
        currentBasicInfo = {
          quote_unit: current.quote_unit,
          base_unit: current.base_unit,
        };
      }
      return {
        ...state,
        prices,
        current,
        currentBasicInfo,
      };
    },
    updateTrades(state, { payload }) {
      // 处理数据
      // 结构
      // trades: [{
      //   amount: "0.5216",
      //   date: 1513407071,
      //   price: "11353.0",
      //   tid: 109,
      //   type: "buy",
      // }]
      const tradesObj = {};
      state.trades.forEach((t) => {
        tradesObj[t.tid] = t;
      });
      payload.trades.forEach((t) => {
        tradesObj[t.tid] = t;
      });
      const trades = Object.keys(tradesObj).map(k => tradesObj[k]);
      trades.sort((a, b) => b.date - a.date);
      payload.trades.concat().slice(0, 30);
      return {
        ...state,
        trades,
      };
    },
    updateOrderBook(state, { payload }) {
      // 处理数据
      // 结构
      // ['price', 'amount', 'total', deep]
      let deep = 0;
      let max = 0;
      const asks = payload.asks.map((row) => {
        const amount = parseFloat(row[1]);
        deep += amount;
        return row.concat([(parseFloat(row[0] * amount)).toFixed(1), deep]);
      });
      max = deep;
      deep = 0;
      const bids = payload.bids.map((row) => {
        const amount = parseFloat(row[1]);
        deep += amount;
        return row.concat([(parseFloat(row[0] * amount)).toFixed(1), deep]);
      });
      if (deep > max) max = deep;
      return {
        ...state,
        orderBook: {
          asks,
          bids,
          max,
        },
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
