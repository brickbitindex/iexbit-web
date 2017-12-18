import React, { Component } from 'react';
import { connect } from 'dva';
// import autobind from 'autobind-decorator';
// import classnames from 'classnames';
// import { FormattedMessage } from 'react-intl';
import wrapWithPanel from '../panel';

import './style.scss';

class Chart extends Component {
  render() {
    return (
      <div id="chart">
      CHART
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default wrapWithPanel(connect(mapStateToProps)(Chart), {
  className: 'chart-panel',
});

