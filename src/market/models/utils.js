const model = {
  namespace: 'utils',
  state: {
    loading: {
      market: true,
      chart: true,
      trades: true,
      myOrders: true,
      history: true,
      orderBook: true,
      balance: true,
    },
  },
  subscriptions: {
    // setup({ dispatch }) {
    //   window.addEventListener('resize', () => {
    //     dispatch({
    //       type: 'updateState',
    //       payload: {
    //         windowWidth
    //       },
    //     });
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
    updateLoading(state, { payload }) {
      const loading = { ...state.loading };
      loading[payload.name] = payload.loading;
      return {
        ...state,
        loading,
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
