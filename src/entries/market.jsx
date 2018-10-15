import dva from 'dva-no-router';
import React from 'react';
import $ from 'jquery';

import '../market/lib/antd/index.less';
import Index, { models } from '../market';
import QUERY from '../market/models/querys';

const locale = localStorage.getItem('BRB_LOCAL') || 'zh-CN';
window.locale = locale;


function render() {
  /* fetch.get(QUERY.I18N(locale), undefined, {
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
  }); */

  $.ajax(QUERY.QUERY_ACCOUNT_BASEINFO).catch((response) => {
    if (response.status === 403) {
      window.location.href = `/${window.locale.toLowerCase()}?open=signin&redirect_to=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`;
    }
  }).done((response) => {
    if (response && !response.data.language) {
      window.locale = 'zh-CN';
    } else if (response && response.data.language) {
      window.locale = response.data.language;
    }
    localStorage.setItem('BRB_LOCAL', window.locale);
    $.ajax(QUERY.I18N(window.locale)).done((data) => {
      // 设置一个全局变量
      window.i18n = data;
      // 初始化
      const app = dva();
      models.forEach(model => app.model(model));

      app.router(param => (
        <Index {...param} />
      ));

      app.start('#main');

      window._appStore = app._store;
    });
  });
}

if (!global.Intl) {
  require.ensure([
    'intl',
  ], (require) => {
    require('intl');

    render();
  });
} else {
  render();
}

