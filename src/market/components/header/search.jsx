import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
// import classnames from 'classnames';
import autobind from 'autobind-decorator';
import Price from './price';
import { Input, Icon, Tabs, Badge } from '../../lib/antd';

const { TabPane } = Tabs;

const localeMap = {
  en: 'Innovation',
  'zh-CN': '创新区',
  'zh-TW': '創新區',
};

const localeEntertainment = {
  en: 'Entertainment',
  'zh-CN': '娱乐区',
  'zh-TW': '娛樂區',
};

function reducePrices(data, locale) {
  let ret = {};
  const carrotMarket = {};
  const normalData = data.filter(node => !node.innovation);
  normalData.forEach((node) => {
    const names = node.name.split('/');
    if (!ret[names[1]]) {
      ret[names[1]] = [];
    }
    ret[names[1]].push({
      ...node,
      currency: names[0],
    });
  });

  if (ret.CARROT) {
    carrotMarket.currencies = ret.CARROT;
    carrotMarket.market = localeEntertainment[locale];
    delete ret.CARROT;
  }

  ret = Object.keys(ret).map(k => ({
    market: k,
    currencies: ret[k],
  }));
  ret.sort((a, b) => {
    if (a.market < b.market) return -1;
    if (a.market === b.market) return 0;
    return 1;
  });

  // 加入创新区
  const innovationData = data.filter(node => node.innovation);
  const innovationMarket = [];
  innovationData.forEach((node) => {
    const names = node.name.split('/');
    innovationMarket.push({
      ...node,
      currency: names[0],
    });
  });
  ret.push({
    // TODO: 语言
    market: localeMap[locale],
    currencies: innovationMarket,
  });

 // 加入娱乐区
  if (carrotMarket.currencies) {
    ret.push(carrotMarket);
  }

  return ret;
}

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      tab: 0,
      currentTabName: '',
    };
    this.$dom = null;
    this.$input = null;
  }
  componentWillReceiveProps(props) {
    if (props.show) {
      setTimeout(() => {
        this.$input.focus();
      }, 100);
    }
  }
  calculateTab(reducedPrices) {
    // 通过currentTabName来确认是否要重置tab
    const { tab, currentTabName } = this.state;
    if (reducedPrices.length === 0) return tab;
    if (!reducedPrices[tab] || reducedPrices[tab].market !== currentTabName) {
      const findMarket = reducedPrices.filter(m => m.market === currentTabName);
      if (findMarket.length > 0) {
        // 找到了currentTabName，重置tab
        const _tab = reducedPrices.indexOf(findMarket[0]);
        setTimeout(() => {
          this.setState({
            tab: _tab,
          });
        }, 0);
        return _tab;
      }
      setTimeout(() => {
        this.setState({
          tab: 0,
          currentTabName: reducedPrices[0].market,
        });
      }, 0);
      return 0;
    }
    return tab;
  }
  @autobind
  handleInputChange(e) {
    this.setState({
      filter: e.target.value.toUpperCase(),
    });
  }
  render() {
    const { prices, locale } = this.props;
    const { filter } = this.state;
    let _prices = prices;
    let reg;
    if (filter.length > 0) {
      reg = new RegExp(filter, 'i');
      _prices = prices.filter(p => p.name.match(reg));
    }
    const reducedPrices = reducePrices(_prices, locale);
    const tab = this.calculateTab(reducedPrices);
    const createTab = market => (
      <span>
        <FormattedMessage id="markets_tab" values={{ name: market.market }} />
        {filter.length > 0 && <Badge count={market.currencies.length} />}
      </span>
    );
    return (
      <div id="search" onClick={this.handleMaskClick} ref={e => this.$dom = e}>
        <div className="search-area">
          <div className="search-input">
            <Input style={{ maxWidth: '390px' }} prefix={<Icon type="search" />} ref={e => this.$input = e} onChange={this.handleInputChange} value={this.state.filter} />
          </div>
          <div className="search-result">
            <Tabs
              className="search-result-tabs-bar"
              onChange={key => this.setState({ currentTabName: key })}
            >
              {reducedPrices.map(market => (
                // <TabPane key={market.market} className={classnames('search-result-tabs-title')} tab={market.market} >
                //   <span className="search-prices-tab">
                //     <FormattedMessage id="markets_tab" values={{ name: market.market }} />
                //     {filter.length > 0 && <span className="search-prices-tab-badge">{market.currencies.length}</span>}
                //   </span>
                // </TabPane>
                <TabPane key={market.market} tab={createTab(market)} />
              ))}
            </Tabs>
            <div className="search-prices">
              {reducedPrices[tab] && reducedPrices[tab].currencies.map((price, i) => (<Price key={i} data={price} highlightReg={reg} />))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

