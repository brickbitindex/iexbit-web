import dva from 'dva-no-router';
import React from 'react';

import Index, { models } from '../market';

const app = dva();

models.forEach(model => app.model(model));

app.router(param => (
  <Index {...param} />
));

app.start('#main');

window._appStore = app._store;
