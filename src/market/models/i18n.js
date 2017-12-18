// how to use.
//
// messages: {
//   hello: 'Hello, {name}',
// },
//
// import { FormattedMessage, FormattedRelative } from 'react-intl';
// <FormattedMessage id="hello" values={{ name: 'Sekai' }} />
// <FormattedRelative value={Date.now()} />

import zh from './i18n/zh.json';


const model = {
  namespace: 'i18n',
  state: {
    locale: 'zh',
    messages: zh,
  },
  subscriptions: {
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
    // updatePrice(state, { payload }) {
    //   const prices = { ...state.prices, ...payload };
    //   return {
    //     ...state,
    //     prices,
    //   };
    // },
  },
};

export default model;
