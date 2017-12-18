// TODO: remove mock data
import data from './account.mock';

const model = {
  namespace: 'account',
  state: {
    balance: {},
    orders: [],
  },
  subscriptions: {
    // TODO:
    setup({ dispatch }) {
      dispatch({
        type: 'updateBalance',
        payload: data.balance,
      });
    },
  },
  effects: {
    // * add(action, { call, put }) {
    //   yield call(delay, 1000);
    //   yield put({ type: 'minus' });
    // },
  },
  reducers: {
    updateBalance(state, { payload }) {
      const balance = {
        ...state.balance,
        ...payload,
      };
      return {
        ...state,
        balance,
      };
    },
  },
};

export default model;
