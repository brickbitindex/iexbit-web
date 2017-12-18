/* eslint no-confusing-arrow: 0 */

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
    // * add(action, { call, put }) {
    //   yield call(delay, 1000);
    //   yield put({ type: 'minus' });
    // },
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
  },
};

export default model;
