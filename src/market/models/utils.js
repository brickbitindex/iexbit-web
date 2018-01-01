const model = {
  namespace: 'utils',
  state: {
    loading: {
      market: true,
      chart: true,
      trades: true,
      myOrders: true,
      order: true,
      history: true,
      orderBook: true,
      balance: true,
      messageCenter: false,
    },
    messages: [],
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
    * pushMessage({ payload }, { select, put }) {
      const { messages, texts } = yield select(({ utils, i18n }) => ({
        messages: utils.messages,
        texts: i18n.messages,
      }));
      const processedPayload = {
        ...payload,
      };
      if (('messagecenter_from_' + processedPayload.from) in texts) {
        processedPayload.from = texts['messagecenter_from_' + processedPayload.from];
      }
      if (processedPayload.message in texts) {
        processedPayload.message = texts[processedPayload.message];
      }
      if (processedPayload.data) {
        Object.keys(processedPayload.data).forEach((key) => {
          const value = processedPayload.data[key];
          processedPayload.message = processedPayload.message.replace(`{${key}}`, value);
        });
      }
      messages.push({
        ...processedPayload,
        time: new Date(),
      });
      yield put({
        type: 'updateState',
        payload: {
          messages: [...messages],
        },
      });
    },
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
