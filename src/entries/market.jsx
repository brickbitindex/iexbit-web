import dva from 'dva-no-router';
import React from 'react';

import Index, { models } from '../market';
import QUERY, { fetch } from '../market/models/querys';


const locale = localStorage.getItem('BRB_LOCAL') || 'zh-CN';
window.locale = locale;

fetch.get(QUERY.I18N(locale), undefined, {
  headers: undefined,
  credentials: undefined,
}).then((i18n) => {
  window.i18n = i18n;
  const app = dva();
  models.forEach(model => app.model(model));

  app.router(param => (
    <Index {...param} />
  ));

  app.start('#main');

  window._appStore = app._store;
});

