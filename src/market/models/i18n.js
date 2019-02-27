// how to use.
//
// messages: {
//   hello: 'Hello, {name}',
// },
//
// import { FormattedMessage, FormattedRelative } from 'react-intl';
// <FormattedMessage id="hello" values={{ name: 'Sekai' }} />
// <FormattedRelative value={Date.now()} />
import $ from 'jquery';
import QUERY, { fetch } from './querys';

/* const changeLocale = locale => () => fetch.get(QUERY.I18N(locale), undefined, {
  headers: undefined,
  credentials: undefined,
}); */

const queryI18n = locale => () => new Promise((resolve) => {
  $.ajax(QUERY.I18N(locale)).done(data => resolve(data));
});
const changeLocale = locale => fetch.post(QUERY.UPDATE_LOCALE, locale).catch(e => e);
const queryBaseInfo = () => fetch.get(QUERY.QUERY_ACCOUNT_BASEINFO);


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
        type: 'queryBaseInfo',
      });
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
    /* * changeLocale({ payload }, { call, select, put }) {
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
    }, */
    * queryBaseInfo(_, { call }) {
      let data = yield call(queryBaseInfo);
      if (!data.success) return;
      data = data.data;
      // gagio
      if (window.gagioUser) {
        window.gagioUser(data.member_id.toString());
      }
    },
    * changeLocale({ payload }, { call, select, put }) {
      const origin = yield select(({ i18n }) => i18n.locale);
      if (origin === payload) return;
      const data = yield call(changeLocale, { locale: payload });
      if (data.success) {
        const i18n = yield call(queryI18n(payload));
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
