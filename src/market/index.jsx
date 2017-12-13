import React from 'react';
import { connect } from 'dva-no-router';

import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';

import models from './models';
import Header from './components/header';
import './g.scss';

addLocaleData([...en, ...zh, ...ja, ...ko]);


const Index = props => (
  <IntlProvider locale={props.locale} messages={props.messages}>
    <div>
      <Header />
    </div>
  </IntlProvider>
);

function mapStateToProps({ i18n }) {
  return {
    locale: i18n.locale,
    messages: i18n.messages,
  };
}

export default connect(mapStateToProps)(Index);
export {
  models,
};
