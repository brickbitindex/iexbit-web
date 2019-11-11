/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import classnames from 'classnames';

function setupCanvas(canvas) {
  // Get the device pixel ratio, falling back to 1.
  const dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  const rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  return ctx;
}

const MAX_RATIO = 0.3;

function processData(currentPrice, book) {
  const { asks, bids } = book;
  // 获得盘口价格
  let center = currentPrice;
  if (!center) {
    if (asks.length === 0 && bids.length === 0) {
      center = 0;
    } else if (asks.length === 0) {
      center = bids[0][0];
    } else if (bids.length === 0) {
      center = asks[0][0];
    } else {
      center = (parseFloat(asks[0][0]) + parseFloat(bids[0][0])) / 2;
    }
  }
  center = parseFloat(center);
  // 计算上下限
  let minLimit = center * (1 - MAX_RATIO);
  let maxLimit = center * (1 + MAX_RATIO);
  if (bids.length > 0) {
    minLimit = Math.max(minLimit, parseFloat(bids[bids.length - 1][0]));
  }
  if (asks.length > 0) {
    maxLimit = Math.min(maxLimit, parseFloat(asks[asks.length - 1][0]));
  }
  // 获取上下限区间内数据
  let limitBids = bids.filter(bid => parseFloat(bid[0]) >= minLimit);
  let limitAsks = asks.filter(ask => parseFloat(ask[0]) <= maxLimit);
  // 重新获取实际上下限
  if (limitBids.length > 0) {
    minLimit = parseFloat(limitBids[limitBids.length - 1][0]);
  }
  if (limitAsks.length > 0) {
    maxLimit = parseFloat(limitAsks[limitAsks.length - 1][0]);
  }
  // 上下限取距离盘口小值做绘图区间
  const renderDiffWidth = Math.min(center - minLimit, maxLimit - center);
  // 累加数据
  limitBids = limitBids.map(bid => ({
    priceText: bid[0],
    barVolume: bid[1],
    price: parseFloat(bid[0]),
    volume: parseFloat(bid[1]),
    diffRatio: (parseFloat(bid[0]) - center) / renderDiffWidth / 2 + 0.5,
  }));
  limitAsks = limitAsks.map(ask => ({
    priceText: ask[0],
    barVolume: ask[1],
    price: parseFloat(ask[0]),
    volume: parseFloat(ask[1]),
    diffRatio: (parseFloat(ask[0]) - center) / renderDiffWidth / 2 + 0.5,
  }));
  for (let i = 1; i < limitBids.length; i += 1) {
    limitBids[i].volume += limitBids[i - 1].volume;
  }
  for (let i = 1; i < limitAsks.length; i += 1) {
    limitAsks[i].volume += limitAsks[i - 1].volume;
  }
  return {
    bids: limitBids,
    asks: limitAsks,
    center,
  };
}

const TOP_OFFSET = 0.2;

function getPoint(data, maxVolume, width, height) {
  const x = data.diffRatio * width;
  let y = 0;
  const h = height * (1 - TOP_OFFSET) * (data.volume / maxVolume);
  y = height - h;
  return {
    x,
    y,
    data,
  };
}

class DepthChart extends Component {
  componentDidMount() {
    const canvas = document.getElementById('depthChart');
    this.ctx = setupCanvas(canvas);
    this.rect = canvas.getBoundingClientRect();
  }

  componentWillReceiveProps(props) {
    this.draw(props.data);
    if (!this.props.show && props.show) {
      setTimeout(() => {
        this.updateRect();
      }, 0);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  updateRect() {
    const canvas = document.getElementById('depthChart');
    this.rect = canvas.getBoundingClientRect();
  }

  draw(data) {
    const { ctx, rect } = this;
    ctx.clearRect(0, 0, rect.width, rect.height);
    const { bids, asks, center } = data;
    let maxBidVolume = 0;
    if (bids.length > 0) {
      maxBidVolume = bids[bids.length - 1].volume;
    }
    let maxAskVolume = 0;
    if (asks.length > 0) {
      maxAskVolume = asks[asks.length - 1].volume;
    }
    const maxVolume = Math.max(maxBidVolume, maxAskVolume);
    // 绘制bid
    const bidPoints = bids.map(bid => getPoint(bid, maxVolume, rect.width, rect.height));
    bidPoints.reverse();
    ctx.beginPath();
    if (bidPoints.length > 0) {
      // 绘制线条
      bidPoints.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      if (bidPoints.length > 0) {
        ctx.lineTo(bidPoints[bidPoints.length - 1].x, rect.height);
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#3DE777';
      ctx.stroke();
      ctx.beginPath();
      // 绘制区域
      bidPoints.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.lineTo(bidPoints[bidPoints.length - 1].x, rect.height);
      ctx.lineTo(0, rect.height);
      ctx.lineTo(bidPoints[0].x, bidPoints[0].y);
      ctx.fillStyle = 'rgba(61, 231, 119, 0.1)';
      ctx.fill();
    }
    // 绘制ask
    const askPoints = asks.map(ask => getPoint(ask, maxVolume, rect.width, rect.height));
    ctx.beginPath();
    if (askPoints.length > 0) {
      // 绘制线条
      ctx.moveTo(askPoints[0].x, rect.height);
      askPoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#F04D64';
      ctx.stroke();
      // 绘制区域
      ctx.beginPath();
      ctx.moveTo(askPoints[0].x, rect.height);
      askPoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(rect.width, rect.height);
      ctx.lineTo(askPoints[0].x, rect.height);
      ctx.fillStyle = 'rgba(240, 77, 100, 0.1)';
      ctx.fill();
    }
  }

  @autobind
  handleMouseMove(e) {
    const { rect } = this;
    const { x } = rect;
    const { pageX } = e;
    const dx = pageX - x;
    console.log(dx);
  }

  render() {
    return (
      <canvas id="depthChart" onMouseMove={this.handleMouseMove} />
    );
  }
}

function mapStateToProps({ market }) {
  const { orderBook, trades } = market;
  let currentTrade = {
    price: 0,
    type: 'buy',
  };
  if (trades && trades.length > 0) {
    currentTrade = market.trades[0];
  }
  const data = processData(currentTrade.price, orderBook);
  return {
    book: market.orderBook,
    data,
    basicInfo: market.currentBasicInfo,
    currentTrade,
  };
}

export default connect(mapStateToProps)(DepthChart);

