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
    gon: window.gon,
    config: {},
    tradesLength: 0,
  },
  subscriptions: {
    setup({ dispatch }) {
      const storedConfig = localStorage.getItem('CB_M_CONFIG');
      const payload = {};
      if (storedConfig) {
        payload.config = JSON.parse(storedConfig);
      }
      dispatch({
        type: 'updateState',
        payload,
      });
    },
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
    * init(_, { put }) {
      const payload = {};
      payload.tradesLength = parseInt(document.querySelector('.cb-panel.trades-panel .cb-panel-content').offsetHeight / 14 + 10, 10);
      console.log(payload);
      yield put({
        type: 'updateState',
        payload,
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


// GON结构如下
// {
//   "env":"production",
//   "local":"zh-CN",
//   "clipboard":{
//       "click":"点击复制",
//       "done":"复制成功"
//   },
//   "current_market":{
//       "id":4,
//       "name":"ETH/BTC",
//       "base_unit":{
//           "key":"ethereum",
//           "code":"ETH",
//           "coin":true,
//           "transaction_url":"https://kovan.etherscan.io/tx/%s"
//       },
//       "quote_unit":{
//           "key":"bitcoin",
//           "code":"BTC",
//           "coin":true,
//           "transaction_url":"https://www.blocktrail.com/tBTC/tx/%s"
//       },
//       "ask_config":{
//           "fee_rate":"0.01",
//           "price_minmov":"0.00000001",
//           "min_amount":"0.00000001"
//       },
//       "bid_config":{
//           "fee_rate":"0.01",
//           "price_minmov":"0.00000001",
//           "min_amount":"0.00000001"
//       },
//       "param":"eth_btc"
//   },
//   "current_user":{
//       "id":2,
//       "sn":"PEAUBVO3MMVTIO",
//       "display_name":null,
//       "email":"a3824036@126.com",
//       "identity_id":null,
//       "created_at":"2017-12-04T19:32:18.000+08:00",
//       "updated_at":"2017-12-04T21:16:15.000+08:00",
//       "state":null,
//       "activated":true,
//       "country_code":null,
//       "phone_number":"8613588020944",
//       "disabled":false,
//       "api_disabled":false,
//       "nickname":null,
//       "name":"任剑",
//       "app_activated":false,
//       "sms_activated":true,
//       "memo":2
//   }
// }

