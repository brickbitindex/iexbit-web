import React, { Component } from 'react';
import { connect } from 'dva';
// import autobind from 'autobind-decorator';

import ActionCable from 'actioncable';

class IActionCable extends Component {
  constructor(props) {
    super(props);
    this.cable = null;
  }
  componentDidMount() {
    const market = this.props.market;
    if (market && market.length > 0) {
      const cable = ActionCable.createConsumer('ws://test.exchange.grootapp.com/cable');
      this.cable = cable;
      this.createSubscription('HallChannel', { channel: 'HallChannel', market, init: true });
      this.createSubscription('PrivateChannel', { channel: 'PrivateChannel', market, init: true });
      this.createSubscription('HallChannel-g', { channel: 'HallChannel' });
    }
  }
  createSubscription(tag, option, handlers = {}) {
    const baseHandler = {
      ...handlers,
    };
    if (handlers.received) {
      baseHandler.received = (data) => {
        this.dataRoute(tag + '/' + data[0], data[1]);
        handlers.received(data);
      };
    } else {
      baseHandler.received = (data) => {
        this.dataRoute(tag + '/' + data[0], data[1]);
      };
    }
    if (handlers.connected) {
      baseHandler.connected = () => {
        console.log(option.channel + ' channel connected');
        handlers.connected();
      };
    } else {
      baseHandler.connected = () => {
        console.log(option.channel + ' channel connected');
      };
    }
    if (handlers.disconnected) {
      baseHandler.disconnected = () => {
        console.log(option.channel + ' channel disconnected');
        handlers.disconnected();
      };
    } else {
      baseHandler.disconnected = () => {
        console.log(option.channel + ' channel disconnected');
      };
    }
    if (handlers.rejected) {
      baseHandler.rejected = () => {
        console.log(option.channel + ' channel rejected');
        handlers.rejected();
      };
    } else {
      baseHandler.rejected = () => {
        console.log(option.channel + ' channel rejected');
      };
    }
    this.cable.subscriptions.create(option, baseHandler);
  }
  dataRoute(channelEvent, data) {
    switch (channelEvent) {
      case 'HallChannel/update':
        this.handleUpdate(data);
        break;
      case 'HallChannel/trades':
        this.handleTrades(data);
        break;
      case 'HallChannel-g/tickers':
        this.handleTickers(data);
        break;
      case 'PrivateChannel/account':
        this.handleAccount(data);
        break;
      case 'PrivateChannel/order':
        this.handleOrders([data]);
        break;
      case 'PrivateChannel/orders':
        this.handleOrders(data);
        break;
      case 'PrivateChannel/trade':
        this.handleTrade(data);
        break;
      default:
        console.log(channelEvent, data);
        break;
    }
  }
  checkLoading(name) {
    if (this.props.loading[name]) {
      this.props.dispatch({
        type: 'utils/updateLoading',
        payload: {
          name,
          loading: false,
        },
      });
    }
  }
  // hall channal
  handleUpdate(data) {
    this.checkLoading('orderBook');
    this.props.dispatch({
      type: 'market/updateOrderBook',
      payload: {
        asks: data.asks.slice(0, 30),
        bids: data.bids.slice(0, 30),
      },
    });
  }
  handleTrades(data) {
    this.checkLoading('trades');
    this.props.dispatch({
      type: 'market/updateTrades',
      payload: data,
    });
  }
  handleTickers(data) {
    this.checkLoading('market');
    this.checkLoading('order');
    this.props.dispatch({
      type: 'market/updatePrices',
      payload: data,
    });
  }
  // private
  handleAccount(data) {
    this.checkLoading('balance');
    this.props.dispatch({
      type: 'account/updateBalance',
      payload: data,
    });
  }
  handleOrders(data) {
    // TODO:
    this.checkLoading('myOrders');
    this.props.dispatch({
      type: 'account/updateOrders',
      payload: data,
    });
  }
  handleTrade(data) {
    // TODO:
    // console.log('PrivateChannel/trade', data);
  }
  render() {
    return (
      <div id="ActionCable" />
    );
  }
}

function mapStateToProps({ utils, market }) {
  return {
    loading: utils.loading,
    market: market.pair,
  };
}

export default connect(mapStateToProps)(IActionCable);
