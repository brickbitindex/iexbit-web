import React, { Component } from 'react';
import { connect } from 'dva';
// import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';

import './style.scss';

class Market extends Component {
  componentDidMount() {
    this.props.onPanelTitleChange(this.props.data.name);
  }
  componentWillReceiveProps(props) {
    this.props.onPanelTitleChange(props.data.name);
  }
  render() {
    const { data } = this.props;
    const change = (parseFloat(data.last) - data.open) / data.open;
    const down = change < 0;
    const baseUnit = data.base_unit.toUpperCase();
    const quoteUnit = data.quote_unit.toUpperCase();
    return (
      <div id="market">
        <div className="market-row">
          <div className="market-current">
            <div>{data.last} <span className="light-text">{quoteUnit}</span></div>
          </div>
        </div>
        <div className="market-row">
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
              <span className={classnames(down ? 'red-text' : 'green-text')}>
                {down ? '-' : '+'}{Math.abs(change * 100).toFixed(2)}%
              </span>
            </div>
            <div className="light-text"><FormattedMessage id="market_change" /></div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ market }) {
  return { data: market.current };
}

export default wrapWithPanel(connect(mapStateToProps)(Market), {
  className: 'market-panel',
});

