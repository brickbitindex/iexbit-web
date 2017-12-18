import React from 'react';
import { connect } from 'dva-no-router';
import 'react-select/dist/react-select.css';

import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';

import models from './models';
import Header from './components/header';
import Market from './components/market';
import { BuyOrder, SellOrder } from './components/order';
import Chart from './components/chart';
import Trades from './components/trades';
import MyOrders from './components/myOrders';
import History from './components/history';
import Balance from './components/balance';
import OrderBook from './components/orderBook';

import WS from './ws';

import './g.scss';

addLocaleData([...en, ...zh, ...ja, ...ko]);

function Index(props) {
  const { locale, messages, loading } = props;
  return (
    <IntlProvider locale={locale} messages={messages}>
      <div>
        <WS />
        <Header />
        <div id="square">
          <div className="left">
            <Market loading={loading.market} />
            <Balance loading={loading.balance} />
            <BuyOrder />
            <SellOrder />
          </div>
          <div className="right">
            <div className="right-top">
              <Chart loading={loading.chart} />
              <Trades loading={loading.trades} />
            </div>
            <MyOrders loading={loading.myOrders} />
            <History loading={loading.history} />
            <OrderBook loading={loading.orderBook} />
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}

function mapStateToProps({ i18n, utils }) {
  return {
    locale: i18n.locale,
    messages: i18n.messages,
    loading: utils.loading,
  };
}

export default connect(mapStateToProps)(Index);
export {
  models,
};
