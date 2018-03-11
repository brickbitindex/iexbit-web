// how to use.
//
// messages: {
//   hello: 'Hello, {name}',
// },
//
// import { FormattedMessage, FormattedRelative } from 'react-intl';
// <FormattedMessage id="hello" values={{ name: 'Sekai' }} />
// <FormattedRelative value={Date.now()} />

import QUERY, { fetch } from './querys';

const changeLocale = locale => () => fetch.get(QUERY.I18N(locale));

const model = {
  namespace: 'i18n',
  state: {
    locale: '',
    messages: {},
  },
  subscriptions: {
    setup({ dispatch }) {
      // 设置locale
      dispatch({
        type: 'updateState',
        payload: {
          locale: window.locale,
          messages: window.i18n,
        },
      });
    },
  },
  effects: {
    * changeLocale({ payload }, { call, select, put }) {
      const origin = yield select(({ utils }) => utils.locale);
      if (origin === payload) return;
      const i18n = yield call(changeLocale(payload));
      if (i18n) {
        // 一些全局变量以及LocalStorage
        window.locale = payload;
        window.i18n = i18n;
        localStorage.setItem('BRB_LOCAL', payload);
        yield put({
          type: 'updateState',
          payload: {
            messages: i18n,
            locale: payload,
          },
        });
      }
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

export default model;
