import React, { Component } from 'react';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import { SYMBOL_ICON } from '../../../assets';
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
  8: 31,
  9: 27,
  10: 24,
};

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
    const { data, pairSymbol } = this.props;
    const change = (parseFloat(data.last) - data.open) / data.open;
    const down = change < 0;
    const baseUnit = data.base_unit;
    const quoteUnit = data.quote_unit;

    const fs = fontSize[data.last.length];
    return (
      <div id="market" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="market-icon">
          <img src={SYMBOL_ICON[pairSymbol]} alt={baseUnit} />
        </div>
        <div className="market-current tt" style={{ fontSize: fs, height: fs }}>{data.last}</div>
        <div className="market-info">
          <div className="light-text">{quoteUnit.toUpperCase()}</div>
          <div>
            <span className={classnames(down ? 'red-text' : 'green-text')}>
              {down ? '-' : '+'}{Math.abs(change * 100).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className={classnames('market-detail pop-dialog a-left', { show: this.state.hover })}>
          <div className="market-row">
            <div className="mt"><FormattedMessage id="market_low" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={data.low} fixed={3} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
          <div className="market-row">
            <div className="mt"><FormattedMessage id="market_high" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={data.high} fixed={3} /> <span className="light-text">{quoteUnit}</span></div>
          </div>
          <div className="market-row">
            <div className="mt"><FormattedMessage id="market_vol" /></div>
            <div className="mv tt"><ZeroFormattedNumber value={data.volume} fixed={3} /> <span className="light-text">{baseUnit}</span></div>
          </div>
        </div>
        {/* <div className="market-row">
          <div className="market-col">
            <div>{data.low} <span className="light-text">{quoteUnit}</span></div>
            <div className="light-text"><FormattedMessage id="market_low" /></div>
          </div>
          <div className="market-col">
            <div>{data.high} <span className="light-text">{quoteUnit}</span></div>
            <div className="light-text"><FormattedMessage id="market_high" /></div>
          </div>
        </div>
        <div className="market-row">
          <div className="market-col">
            <div>{data.volume} <span className="light-text">{baseUnit}</span></div>
            <div className="light-text"><FormattedMessage id="market_vol" /></div>
          </div>
          <div className="market-col">
            <div>
            </div>
            <div className="light-text"><FormattedMessage id="market_change" /></div>
          </div>
        </div> */}
      </div>
    );
  }
}

function mapStateToProps({ market }) {
  return {
    data: market.current,
    pairSymbol: market.pairSymbol,
  };
}

export default wrapWithPanel(connect(mapStateToProps)(Market), {
  className: 'market-panel',
});

