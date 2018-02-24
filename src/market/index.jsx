import React, { Component } from 'react';
import { connect } from 'dva-no-router';

import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';

import models from './models';
// import { wrapWithTabPanel } from './components/panel';
import Header from './components/header';
import Market from './components/market';
import { BuyOrder, SellOrder } from './components/order';
import Chart from './components/chart';
import Trades from './components/trades';
// import History from './components/history';
// import Balance from './components/balance';
import OrderBook from './components/orderBook';
import TabPanel from './components/tabPanel';

import WS from './ws';

import './g.scss';

addLocaleData([...en, ...zh, ...ja, ...ko]);

/* <MyOrders loading={loading.myOrders} />
  <History loading={loading.history} />
  <Balance loading={loading.balance} /> */

class Index extends Component {
  componentDidMount() {
    // TODO: .no-panel-anime
    // const config = this.props;
    // if (config.lastUpdate && config.lastUpdate) {

    // }
    this.props.dispatch({
      type: 'utils/init',
    });
  }
  render() {
    const { locale, messages, loading } = this.props;
    return (
      <IntlProvider locale={locale} messages={messages}>
        <div id="squareContainer" className="no-panel-anime">
          <WS />
          <div id="square">
            <Header />
            <div className="sq-b flex-autofixed">
              <div className="sq-b-l flex-autofixed">
                <div className="sq-b-l-t flex-autofixed">
                  <Chart className="flex-autofixed" />
                  <div className="sq-b-l-t-r flex-fixed">
                    <Market loading={loading.market} className="flex-fixed" />
                    <Trades loading={loading.trades} className="flex-autofixed" />
                  </div>
                </div>
                <TabPanel loadings={loading} className="flex-fixed the-tabs" />
              </div>
              <div className="sq-b-r flex-fixed">
                <OrderBook loading={loading.orderBook} className="flex-autofixed" />
                <div className="sq-b-r-b flex-fixed">
                  <BuyOrder className="flex-fixed" loading={loading.order} />
                  <SellOrder className="flex-fixed" loading={loading.order} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </IntlProvider>
    );
  }
}

function mapStateToProps({ i18n, utils }) {
  return {
    locale: i18n.locale,
    messages: i18n.messages,
    loading: utils.loading,
    config: utils.config,
  };
}

export default connect(mapStateToProps)(Index);
export {
  models,
};
