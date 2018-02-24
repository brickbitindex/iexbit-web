import React, { Component } from 'react';
import { connect } from 'dva';
// import autobind from 'autobind-decorator';
import ActionCable from 'actioncable';

import toast from '../components/common/toast';

const channalConnect = {};

function getAllChannelConnect() {
  let c = true;
  Object.keys(channalConnect).forEach((key) => {
    c = c && channalConnect[key];
  });
  return c;
}

class IActionCable extends Component {
  constructor(props) {
    super(props);
    this.cable = null;
  }
  componentDidMount() {
    const market = this.props.market;
    if (market && market.length > 0) {
      const cable = ActionCable.createConsumer();
      this.cable = cable;
      this.createSubscription('HallChannel', { channel: 'HallChannel', market, init: true });
      // this.createSubscription('HallChannel-g', { channel: 'HallChannel' });
      if (!this.props.anonymous) {
        this.createSubscription('PrivateChannel', { channel: 'PrivateChannel', market, init: true });
      }
    }
  }
  checkAllChannelConnect(tag) {
    channalConnect[tag] = true;
    if (getAllChannelConnect()) {
      if (this.props.anonymous) {
        this.checkLoading('myOrders');
        this.checkLoading('order');
      }
      toast.info('text_connect');
      this.props.dispatch({
        type: 'utils/pushMessage',
        payload: {
          message: 'text_connect',
          from: 'sys',
          level: 'verbose',
        },
      });
    }
  }
  channalDisconnected(tag) {
    if (getAllChannelConnect()) {
      toast.warn('text_disconnect');
      this.props.dispatch({
        type: 'utils/pushMessage',
        payload: {
          message: 'text_disconnect',
          from: 'sys',
          level: 'warn',
        },
      });
    }
    channalConnect[tag] = false;
  }
  createSubscription(tag, option, handlers = {}) {
    const baseHandler = {
      ...handlers,
    };
    channalConnect[tag] = false;
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
        console.log(tag + ' channel connected111');
        handlers.connected();
        this.checkAllChannelConnect(tag);
      };
    } else {
      baseHandler.connected = () => {
        console.log(tag + ' channel connected');
        this.checkAllChannelConnect(tag);
      };
    }
    if (handlers.disconnected) {
      baseHandler.disconnected = () => {
        console.log(tag + ' channel disconnected');
        handlers.disconnected();
        this.channalDisconnected(tag);
      };
    } else {
      baseHandler.disconnected = () => {
        console.log(tag + ' channel disconnected');
        this.channalDisconnected(tag);
      };
    }
    if (handlers.rejected) {
      baseHandler.rejected = () => {
        console.log(tag + ' channel rejected');
        handlers.rejected();
      };
    } else {
      baseHandler.rejected = () => {
        console.log(tag + ' channel rejected');
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
      // case 'HallChannel-g/tickers':
      //   this.handleTickers(data);
      //   break;
      case 'PrivateChannel/account':
        this.handleAccount(data);
        break;
      case 'PrivateChannel/accounts':
        this.handleAccount(data.attributes);
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
        asks: data.asks,
        bids: data.bids,
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
  // handleTickers(data) {
  //   this.checkLoading('market');
  //   this.checkLoading('order');
  //   this.props.dispatch({
  //     type: 'market/updatePrices',
  //     payload: data,
  //   });
  // }
  // private
  handleAccount(data) {
    console.log(data);
    this.checkLoading('balance');
    this.props.dispatch({
      type: 'account/updateBalance',
      payload: data,
    });
  }
  handleOrders(data) {
    // TODO:
    this.checkLoading('myOrders');
    this.checkLoading('order');
    this.props.dispatch({
      type: 'account/updateOrders',
      payload: data,
    });
  }
  handleTrade(/* data */) {
    // TODO:
    // console.log('PrivateChannel/trade', data);
  }
  render() {
    return (
      <div id="ActionCable" />
    );
  }
}

function mapStateToProps({ utils, market, account }) {
  return {
    loading: utils.loading,
    market: market.id,
    anonymous: account.anonymous,
  };
}

export default connect(mapStateToProps)(IActionCable);
