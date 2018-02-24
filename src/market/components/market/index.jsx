import React, { Component } from 'react';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import ZeroFormattedNumber from '../common/zeroFormattedNumber';

import './style.scss';

const fontSize = {
  1: 40,
  2: 40,
  3: 40,
  4: 40,
  5: 40,
  6: 40,
  7: 35,
  8: 35,
  9: 35,
  10: 31,
  11: 27,
  12: 24,
  13: 24,
  14: 24,
};

let maxLength = 0;
let fs = 24;

class Market extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }
  @autobind
  handleMouseEnter() {
    this.setState({
      hover: true,
    });
  }
  @autobind
  handleMouseLeave() {
    this.setState({
      hover: false,
    });
  }
  render() {
    const { data, pairSymbol, currentPrice, basicInfo } = this.props;
    const ticker = data.ticker;
    const change = (parseFloat(currentPrice) - ticker.open) / ticker.open;
    const down = change < 0;
    const baseUnit = basicInfo.base_unit.code;
    const quoteUnit = basicInfo.quote_unit.code;
    console.log(basicInfo);

    if (currentPrice.length > maxLength) {
      maxLength = currentPrice.length;
      fs = fontSize[maxLength];
    }

    return (
      <div id="market" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="market-row">
          <div className="market-icon">
            <img src={`/market_images/symbol_icon_${pairSymbol}.png`} alt={baseUnit} />
          </div>
          <div className="market-name">{baseUnit}/{quoteUnit}</div>
        </div>
        <div className="market-row">
          <div className="market-current tt" style={{ fontSize: fs, height: fs }}>{currentPrice}</div>
          <div className="market-info">
            <div className="light-text">{quoteUnit.toUpperCase()}</div>
            <div>
              <span className={classnames(down ? 'red-text' : 'green-text')}>
                {down ? '-' : '+'}{Math.abs(change * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className={classnames('market-detail pop-dialog a-left', { show: this.state.hover })}>
          <div className="market-detail-row">
            <div className="mt"><FormattedMessage id="market_low" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={ticker.low} fixed={3} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
          <div className="market-detail-row">
            <div className="mt"><FormattedMessage id="market_high" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={ticker.high} fixed={3} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
          <div className="market-detail-row">
            <div className="mt"><FormattedMessage id="market_vol" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={ticker.volume} fixed={3} /> <span className="light-text">{baseUnit}</span></div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ market }) {
  return {
    data: market.current,
    pairSymbol: market.pairSymbol,
    currentPrice: market.currentPrice,
    basicInfo: market.currentBasicInfo,
  };
}

export default wrapWithPanel(connect(mapStateToProps)(Market), {
  className: 'market-panel',
});

