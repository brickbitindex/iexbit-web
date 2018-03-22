/* eslint no-prototype-builtins: 0 */
// import Decimal from 'decimal.js-light';
import QUERY, { fetch } from './../../models/querys';

const defaultConfig = {
  supports_search: false,
  supports_group_request: false,
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  exchanges: [],
  symbols_types: [],
  supported_resolutions: ['1', '5', '15', '30', '60', '120', '360', '720', '1D', '3D'],
};

// {"supports_search":false,"supports_group_request":false,"supports_marks":false,"supports_timescale_marks":false,"supports_time":true,"exchanges":[],"symbols_types":[]}
// {"supports_search":false,"supports_group_request":false,"supports_marks":false,"supports_timescale_marks":false,"supports_time":true,"exchanges":[],"symbols_types":[],"supported_resolutions":["1","5","15","30","60","180","360","720","1D","1W"]}

const resolutionToMinutes = {
  1: 1,
  5: 5,
  15: 15,
  30: 30,
  60: 60,
  120: 120,
  360: 360,
  720: 720,
  '1D': 1440,
  D: 1440,
  '3D': 4320,
  '1W': 10080,
  W: 10080,
};

class DataPulseUpdater {
  constructor(datafeed, updateFrequency) {
    this._datafeed = datafeed;
    this._subscribers = {};
    this._requestsPending = 0;

    if (typeof updateFrequency !== 'undefined' && updateFrequency > 0) {
      setInterval(this.update.bind(this), updateFrequency);
    }
  }

  update() {
    if (this._requestsPending > 0) {
      return;
    }

    Object.keys(this._subscribers).forEach((listenerGUID) => {
      const subscriptionRecord = this._subscribers[listenerGUID];
      const resolution = subscriptionRecord.resolution;

      const datesRangeRight = parseInt((new Date().valueOf()) / 1000, 10);
      // BEWARE: please note we really need 2 bars, not the only last one
      // see the explanation below. `10` is the `large enough` value to work around holidays
      // 24*7没有休息！2个bar保底足以
      const datesRangeLeft = datesRangeRight - this.periodLengthSeconds(resolution, 2);

      this._requestsPending += 1;

      this._datafeed.getBars(subscriptionRecord.symbolInfo, resolution, datesRangeLeft, datesRangeRight, (bars) => {
        this._requestsPending -= 1;
        // means the subscription was cancelled while waiting for data
        if (!this._subscribers.hasOwnProperty(listenerGUID)) {
          return;
        }
        if (bars.length === 0) {
          return;
        }
        const lastBar = bars[bars.length - 1];
        if (!isNaN(subscriptionRecord.lastBarTime) && lastBar.time < subscriptionRecord.lastBarTime) {
          return;
        }

        const subscribers = subscriptionRecord.listeners;
        // BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
        // _subscriptionRecord.lastBarTime = NaN
        const isNewBar = !isNaN(subscriptionRecord.lastBarTime) && lastBar.time > subscriptionRecord.lastBarTime;

        // Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
        // old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
        if (isNewBar) {
          if (bars.length < 2) {
            throw new Error('Not enough bars in history for proper pulse update. Need at least 2.');
          }

          const previousBar = bars[bars.length - 2];
          for (let i = 0; i < subscribers.length; i += 1) {
            subscribers[i](previousBar);
          }
        }

        subscriptionRecord.lastBarTime = lastBar.time;
        for (let i = 0; i < subscribers.length; i += 1) {
          subscribers[i](lastBar);
        }
      }, () => {
        this._requestsPending -= 1;
      });
    });
  }

  unsubscribeDataListener(listenerGUID) {
    // this._datafeed._logMessage('Unsubscribing ' + listenerGUID);
    delete this._subscribers[listenerGUID];
  }

  subscribeDataListener(symbolInfo, resolution, newDataCallback, listenerGUID) {
    // this._datafeed._logMessage('Subscribing ' + listenerGUID);

    if (!this._subscribers.hasOwnProperty(listenerGUID)) {
      this._subscribers[listenerGUID] = {
        symbolInfo,
        resolution,
        lastBarTime: NaN,
        listeners: [],
      };
    }

    this._subscribers[listenerGUID].listeners.push(newDataCallback);
  }

  periodLengthSeconds(resolution, requiredPeriodsCount) {
    let daysCount = 0;
    if (resolution === 'D') {
      daysCount = requiredPeriodsCount;
    } else if (resolution === 'M') {
      daysCount = 31 * requiredPeriodsCount;
    } else if (resolution === 'W') {
      daysCount = 7 * requiredPeriodsCount;
    } else {
      daysCount = requiredPeriodsCount * resolution / (24 * 60);
    }
    return daysCount * 24 * 60 * 60;
  }
}


export default class Datafeed {
  constructor(symbolName, symbolDescription, basicInfo, updateFrequency = 6 * 1000) {
    this.updateFrequency = updateFrequency;
    this.symbolName = symbolName;
    this.symbolDescription = symbolDescription;
    this.basicInfo = basicInfo;
    this._callbacks = {};
    this._configuration = null;
    this._initializationFinished = false;

    this._barsPulseUpdater = new DataPulseUpdater(this, updateFrequency);

    this._ddd = true;

    this._initialize();
  }
  // private APIS
  on(event, callback) {
    if (!this._callbacks.hasOwnProperty(event)) {
      this._callbacks[event] = [];
    }
    this._callbacks[event].push(callback);
    return this;
  }
  _fireEvent(event, argument) {
    if (this._callbacks.hasOwnProperty(event)) {
      const callbacksChain = this._callbacks[event];
      for (let i = 0; i < callbacksChain.length; i += 1) {
        callbacksChain[i](argument);
      }
      this._callbacks[event] = [];
    }
  }
  getSymbol() {
    return {
      name: this.symbolName,
      ticker: this.symbolName,
      description: this.symbolDescription,
      type: 'bitcoin',
      session: '24x7',
      timezone: 'Asia/Shanghai',
      'exchange-listed': 'Bitrabbit',
      'exchange-traded': 'Bitrabbit',
      minmov: 1,
      pricescale: this.basicInfo.bid_config.pricescale,
      volume_precision: this.basicInfo.bid_config.amount_fixed,
      minmov2: 0,
      has_intraday: true,
      has_empty_bars: true,
      // supported_resolutions: ['1', '5', '15', '30', '60', '180', '1D', '1W', '1M'],
      data_status: 'streaming',
    };
  }
  getNearestBarTime(time, resolution) {
    const s = resolutionToMinutes[resolution] * 60;
    return time - time % s + s;
  }
  // 直接用map，这个函数暂时放弃
  getResolutionMinutes(resolution) {
    let _resolution = 1;
    if (resolution === 'D') {
      _resolution = 24 * 60;
    } else if (resolution === 'M') {
      _resolution = 31 * 24 * 60;
    } else if (resolution === 'W') {
      _resolution = 7 * 24 * 60;
    } else {
      _resolution = parseInt(resolution, 10);
    }
    return _resolution;
  }

  // life
  _initialize() {
    // get config
    // TODO:
    setTimeout(() => {
      this._setupWithConfiguration(defaultConfig);
    }, 1000);
  }
  _setupWithConfiguration(config) {
    this._configuration = config;
    this._initializationFinished = true;
    this._fireEvent('initialized');
    this._fireEvent('configuration_ready');
  }
  // TV APIS
  onReady(callback) {
    if (this._initializationFinished) {
      callback(this._configuration);
    }
    this.on('configuration_ready', () => {
      callback(this._configuration);
    });
  }

  searchSymbols() {}

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    if (!this._initializationFinished) {
      this.on('initialized', () => {
        this.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
      });
      return;
    }

    // get symbol
    // TODO:
    setTimeout(() => {
      onSymbolResolvedCallback(this.getSymbol());
    }, 1000);
  }

  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback, firstDataRequest) {
    // console.log(symbolInfo);

    // console.log(resolution, new Date(rangeStartDate * 1000), rangeStartDate, new Date(rangeEndDate * 1000), firstDataRequest);
    // source: [时间戳，开盘价，最高价，最低价，收盘价，交易量]
    // target: {"time":1482969600000,"close":116.73,"open":116.45,"high":117.1095,"low":116.4,"volume":15039519}

    const resolutionMinutes = resolutionToMinutes[resolution];
    const params = {
      market: this.symbolName,
      period: resolutionMinutes,
      timestamp: rangeStartDate,
      end: rangeEndDate,
    };
    if (firstDataRequest === false) {
      params.timestamp = rangeStartDate;
    }
    fetch.get(QUERY.K, params).then((data) => {
      let processedData = data.map(d => ({
        time: d[0] * 1000,
        open: +d[1],
        high: +d[2],
        low: +d[3],
        close: +d[4],
        volume: +d[5],
      }));
      const noData = processedData.length === 0;
      // console.log(processedData.length, new Date(rangeStartDate * 1000), new Date(processedData[0].time), new Date(processedData[processedData.length - 1].time));
      // 数据少于1条补齐2条
      if (processedData.length === 1) {
        const zero = processedData[0];
        processedData = [{
          time: processedData[0].time - resolutionMinutes * 60 * 1000,
          open: zero.open,
          high: zero.open,
          low: zero.open,
          close: zero.open,
          volume: 0,
        }].concat(processedData);
      }
      // 补齐第一个数据
      if (firstDataRequest && !noData) {
        const zero = processedData[0];
        processedData = [{
          time: this.getNearestBarTime(rangeStartDate, resolution) * 1000,
          open: zero.open,
          high: zero.open,
          low: zero.open,
          close: zero.open,
          volume: 0,
        }].concat(processedData);
      }
      onDataCallback(processedData, { noData, nextTime: undefined });
    });
  }

  subscribeBars(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
    this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
    // console.log(symbolInfo);
  }

  unsubscribeBars(listenerGUID) {
    // console.log(listenerGUID);
    this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
  }
}
