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

import MobileNav from './components/mobileNav';

import WS from './ws';

import './layout.scss';
import './g.scss';

addLocaleData([...en, ...zh, ...ja, ...ko]);

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
    const { locale, messages, loading, mobileShowPart } = this.props;
    const localePrefix = locale.split('-')[0];
    return (
      <IntlProvider locale={localePrefix} key={locale} messages={messages}>
        <div id="squareContainer" className="no-panel-anime">
          <WS />
          <div id="square" className={`m-show-${mobileShowPart}`}>
            <Header />
            <MobileNav />
            <div className="sq-b flex-autofixed">
              <div className="sq-b-l flex-autofixed">
                <Chart />
                <TabPanel loadings={loading} className="the-tabs" />
              </div>
              <div className="sq-b-r flex-fixed">
                <div className="sq-b-r-t flex-autofixed">
                  <OrderBook loading={loading.orderBook}>
                    <Market loading={loading.market} className="flex-fixed" />
                  </OrderBook>
                  <Trades loading={loading.trades} />
                </div>
                <div className="sq-b-r-b">
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

function mapStateToProps({ i18n, utils, mobile }) {
  return {
    locale: i18n.locale,
    messages: i18n.messages,
    loading: utils.loading,
    config: utils.config,
    mobileShowPart: mobile.showPart,
  };
}

export default connect(mapStateToProps)(Index);
export {
  models,
};
