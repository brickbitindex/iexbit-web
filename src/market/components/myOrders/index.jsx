import React, { Component } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
// import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { injectIntl, FormattedMessage, FormattedTime, FormattedDate, FormattedNumber } from 'react-intl';
import wrapWithPanel from '../panel';
import ZeroFormattedNumber from '../common/zeroFormattedNumber';

import './style.scss';

const reg = /0+$/;

class MyOrders extends Component {
  handleDelete(data) {
    this.props.dispatch({
      type: 'account/deleteOrder',
      payload: data,
    });
  }
  formatNumber(number, option) {
    const formatNumber = this.props.intl.formatNumber;
    const ret = formatNumber(number, option);
    const zero = ret.match(reg);
    if (zero) {
      return <span>{ret.slice(0, zero.index)}<span className="light-text">{zero[0]}</span></span>;
    }
    return <span>{ret}</span>;
  }
  render() {
    const { data } = this.props;
    return (
      <div id="myOrders">
        <div className="myorder-row thead light-text">
          <div className="myorder-col type"><FormattedMessage id="myorder_type" /></div>
          <div className="myorder-col state"><FormattedMessage id="myorder_state" /></div>
          <div className="myorder-col price"><FormattedMessage id="myorder_price" /></div>
          <div className="myorder-col amount"><FormattedMessage id="myorder_amount" /></div>
          <div className="myorder-col placed"><FormattedMessage id="myorder_placed" /></div>
          <div className="myorder-col opt"><FormattedMessage id="myorder_opt" /></div>
        </div>
        {data.map((row) => {
          const partial = row.volume !== row.origin_volume;
          const date = new Date(row.at * 1000);
          return (
            <div className="myorder-row" key={row.id}>
              <div className="myorder-col type light-text">
                <FormattedMessage id={'order_type_limit'} />
              </div>
              <div className="myorder-col state">
                <span className={classnames('tag', { partial })}><FormattedMessage id={partial ? 'myorder_partial' : 'myorder_wait'} /></span>
              </div>
              <div className={classnames('myorder-col price tt', row.kind === 'bid' ? 'green-text' : 'red-text')}>
                <FormattedNumber value={row.price} />
              </div>
              <div className="myorder-col amount tt">
                <ZeroFormattedNumber value={row.volume} option={{ minimumFractionDigits: 3 }} />
                {partial && (
                  <span className="light-text"> / <ZeroFormattedNumber value={row.origin_volume} option={{ minimumFractionDigits: 3 }} /></span>
                )}
              </div>
              <div className="myorder-col placed tt">
                <FormattedDate value={date} month="2-digit" day="2-digit" /> <FormattedTime value={date} hour="2-digit" minute="2-digit" hour12={false} />
              </div>
              <div className="myorder-col opt">
                <span onClick={() => this.handleDelete(row)}><i className="icon anticon icon-delete" /></span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return { data: account.orders };
}

export default wrapWithPanel(connect(mapStateToProps)(injectIntl(MyOrders)), {
  title: <FormattedMessage id="myorders" />,
  className: 'myOrder-panel',
});
