import React, { Component } from 'react';
import { connect } from 'dva';
// import autobind from 'autobind-decorator';
import classnames from 'classnames';
// import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';
import { SYMBOL_ICON } from '../../../assets';

import './style.scss';

class Market extends Component {
  render() {
    const { data, pairSymbol } = this.props;
    const change = (parseFloat(data.last) - data.open) / data.open;
    const down = change < 0;
    const baseUnit = data.base_unit;
    const quoteUnit = data.quote_unit;
    return (
      <div id="market">
        <div className="market-icon">
          <img src={SYMBOL_ICON[pairSymbol]} alt={baseUnit} />
        </div>
        <div className="market-current tt">{data.last}</div>
        <div className="market-info">
          <div className="light-text">{quoteUnit.toUpperCase()}</div>
          <div>
            <span className={classnames(down ? 'red-text' : 'green-text')}>
              {down ? '-' : '+'}{Math.abs(change * 100).toFixed(2)}%
            </span>
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

