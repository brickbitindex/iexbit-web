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
import React from 'react';
import Decimal from 'decimal.js-light';
import { FormattedMessage } from 'react-intl';
import QUERY, { fetch } from './querys';
import toast from '../components/common/toast';

const addBidOrder = data => fetch.post(QUERY.ADD_BID_ORDER, data).catch(err => err);
const addAskOrder = data => fetch.post(QUERY.ADD_ASK_ORDER, data).catch(err => err);
const queryPrices = () => fetch.get(QUERY.QUERY_PRICES).catch(err => err);

function getDecimalFixed(decimal) {
  if (new Decimal('1').lte(decimal)) return 0;
  return decimal.log().abs().toNumber();
}

// {
//   text: '8位小数',
//   mask: '0.00000001'
// }
function getDeepSelect(fixed) {
  const ret = [];
  for (let i = 0; i < 4; i += 1) {
    const currentFixed = fixed - i;
    const step = Math.pow(10, -currentFixed);
    if (currentFixed <= 0) {
      // 整数
      ret.push({
        text: <FormattedMessage id="orderbook_deep_integer" values={{ num: step }} />,
        step,
      });
    } else {
      ret.push({
        text: <FormattedMessage id="orderbook_deep_decimal" values={{ num: currentFixed }} />,
        step,
      });
    }
  }
  return ret;
}

function initCurrentBasicInfo() {
  const origin = window.gon.current_market;
  const currentBasicInfo = {};
  currentBasicInfo.base_unit = origin.base_unit;
  currentBasicInfo.quote_unit = origin.quote_unit;
  currentBasicInfo.ask_config = {
    fee_rate: new Decimal(origin.ask_config.fee_rate),
    price_minmov: new Decimal(origin.ask_config.price_minmov),
    min_amount: new Decimal(origin.ask_config.min_amount),
  };
  // 用于chart的pricescale
  currentBasicInfo.ask_config.pricescale = parseInt(new Decimal('1').div(currentBasicInfo.ask_config.price_minmov).toString(), 10);
  // 用于价格的fixed
  currentBasicInfo.ask_config.price_fixed = getDecimalFixed(currentBasicInfo.ask_config.price_minmov);
  // 用于数量的fixed
  currentBasicInfo.ask_config.amount_fixed = getDecimalFixed(currentBasicInfo.ask_config.min_amount);
  currentBasicInfo.bid_config = {
    fee_rate: new Decimal(origin.bid_config.fee_rate),
    price_minmov: new Decimal(origin.bid_config.price_minmov),
    min_amount: new Decimal(origin.bid_config.min_amount),
  };
  currentBasicInfo.bid_config.pricescale = parseInt(new Decimal('1').div(currentBasicInfo.bid_config.price_minmov).toString(), 10);
  currentBasicInfo.bid_config.price_fixed = getDecimalFixed(currentBasicInfo.bid_config.price_minmov);
  currentBasicInfo.bid_config.amount_fixed = getDecimalFixed(currentBasicInfo.bid_config.min_amount);
  // 深度选项
  currentBasicInfo.deepSelectOptions = getDeepSelect(currentBasicInfo.ask_config.price_fixed);
  return currentBasicInfo;
}

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
      const currentBasicInfo = initCurrentBasicInfo();

      dispatch({
        type: 'updateState',
        payload: {
          id,
          pair,
          pairSymbol,
          currentBasicInfo,
        },
      });

      function qp() {
        dispatch({ type: 'queryPrices' });
      }

      setInterval(qp, 30000);
      qp();
    },
  },
  effects: {
    * addOrder({ payload }, { call, put, select }) {
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
      if (response.result) {
        toast.info('text_order_success');
        const currentBasicInfo = yield select(({ market }) => market.currentBasicInfo);
        yield put({
          type: 'utils/pushMessage',
          payload: {
            message: `messagecenter_order_${payload.type}_success`,
            from: 'trade',
            level: 'info',
            data: {
              price: data.price,
              amount: data.amount,
              quote_unit: currentBasicInfo.quote_unit.code,
              base_unit: currentBasicInfo.base_unit.code,
            },
          },
        });
      } else {
        toast.error(response.message);
      }
    },
    * queryPrices(_, { select, call, put }) {
      const data = yield call(queryPrices);
      const loading = yield select(({ utils }) => utils.loading.market);
      if (loading) {
        yield put({
          type: 'utils/updateLoading',
          payload: {
            name: 'market',
            loading: false,
          },
        });
      }
      yield put({
        type: 'updatePrices',
        payload: data,
      });
    },
    * updateTrades({ payload }, { select, put }) {
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
      let trades = yield select(({ market }) => market.trades);
      trades.forEach((t) => {
        tradesObj[t.tid] = t;
      });
      payload.trades.forEach((t) => {
        tradesObj[t.tid] = t;
      });
      trades = Object.keys(tradesObj).map(k => tradesObj[k]);
      trades.sort((a, b) => b.date - a.date);
      yield put({
        type: 'updateState',
        payload: {
          trades,
        },
      });
    },
    * updateOrderBook({ payload }, { put }) {
      // 处理数据
      // 结构
      // ['price', 'amount', 'total', deep]
      // let deep = 0;
      // let max = 0;
      // const asks = payload.asks.map((row) => {
      //   const amount = parseFloat(row[1]);
      //   deep += amount;
      //   return row.concat([(parseFloat(row[0] * amount)), deep]);
      // });
      // max = deep;
      // deep = 0;
      // const bids = payload.bids.map((row) => {
      //   const amount = parseFloat(row[1]);
      //   deep += amount;
      //   return row.concat([(parseFloat(row[0] * amount)), deep]);
      // });
      // if (deep > max) max = deep;
      const asks = payload.asks;
      const bids = payload.bids;
      yield put({
        type: 'updateState',
        payload: {
          orderBook: {
            asks,
            bids,
          },
        },
      });
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
      if (!current) {
        console.log('[market/updatePrice] no pair in price');
        current = {
          id: -1,
          name: currentPair,
          ticker: {
            buy: '0.0',
            high: '0.0',
            last: '0.0',
            low: '0.0',
            open: '0.0',
            sell: '0.0',
            volume: '0.0',
          },
        };
      }
      return {
        ...state,
        prices,
        current,
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
