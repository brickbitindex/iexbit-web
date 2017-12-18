import React, { Component } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
// import autobind from 'autobind-decorator';
// import classnames from 'classnames';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import wrapWithPanel from '../panel';

import './style.scss';

class MyOrders extends Component {
  handleDelete(data) {
    this.props.dispatch({
      type: 'account/deleteOrder',
      payload: data,
    });
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
          <div className="myorder-col opt"><FormattedMessage id="myorder_opt" /></div>
        </div>
        {data.map((row) => {
          const partail = row.volume !== row.origin_volume;
          return (
            <div className="myorder-row" key={row.id}>
              <div className="myorder-col type light-text">
                <FormattedMessage id={'order_type_limit'} />
              </div>
              <div className="myorder-col state">
                <FormattedMessage id={partail ? 'myorder_partail' : 'myorder_wait'} />
              </div>
              <div className="myorder-col price tt">
                <FormattedNumber value={row.price} />
              </div>
              <div className="myorder-col amount tt">
                <FormattedNumber value={row.volume} />
                {partail && (
                  <span className="light-text"> / <FormattedNumber value={row.origin_volume} /></span>
                )}
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

export default wrapWithPanel(connect(mapStateToProps)(MyOrders), {
  title: <FormattedMessage id="myorders" />,
  slideable: true,
  className: 'myOrder-panel',
});
