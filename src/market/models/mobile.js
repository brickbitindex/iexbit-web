function isMobile() {
  return window.innerWidth < 875;
}

export default {
  namespace: 'mobile',
  state: {
    showPart: 'market',
    isMobile: false,
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'updateState',
        payload: {
          isMobile: isMobile(),
        },
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
