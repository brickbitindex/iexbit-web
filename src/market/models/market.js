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

// TODO: remove mock data
import data from './market.mock';

const model = {
  namespace: 'market',
  state: {
    prices: [],
  },
  subscriptions: {
    // TODO:
    setup({ dispatch }) {
      dispatch({
        type: 'updatePrice',
        payload: data.prices,
      });
    },
    // keyboardWatcher({ dispatch }) {
    //   key('⌘+up, ctrl+up', () => { dispatch({ type: 'add' }); });
    // },
  },
  effects: {
    // * add(action, { call, put }) {
    //   yield call(delay, 1000);
    //   yield put({ type: 'minus' });
    // },
  },
  reducers: {
    updatePrice(state, { payload }) {
      const prices = [...state.prices, ...payload];
      return {
        ...state,
        prices,
      };
    },
  },
};

export default model;
