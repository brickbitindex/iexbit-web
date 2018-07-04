import React, { Component } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
// import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { injectIntl, FormattedMessage, FormattedTime, FormattedDate } from 'react-intl';
import ZeroFormattedNumber from '../../../common/zeroFormattedNumber';

import Mask from '../../../common/anonymousMask';

import { Table } from '../../../../lib/antd';

import './style.scss';

const reg = /0+$/;

class MyOrders extends Component {
  getCols() {
    return [{
      title: <FormattedMessage id="myorder_type" />,
      dataIndex: 'id',
      key: 'id',
      className: 'type',
      render: () => <FormattedMessage id="order_type_limit" />,
    }, {
      title: <FormattedMessage id="myorder_placed" />,
      dataIndex: 'date',
      key: 'date',
      className: 'date',
      render: (_, record) => (
        <span>
          <FormattedDate value={record.date} month="2-digit" day="2-digit" /> <FormattedTime value={record.date} hour="2-digit" minute="2-digit" hour12={false} />
        </span>
      ),
    }, {
      title: <FormattedMessage id="myorder_state" />,
      dataIndex: 'partial',
      key: 'partial',
      className: 'state',
      render: (_, record) => <span className={classnames('tag', { partial: record.partial })}><FormattedMessage id={record.partial ? 'myorder_partial' : 'myorder_wait'} /></span>,
    }, {
      title: <FormattedMessage id="myorder_price" />,
      dataIndex: 'price',
      key: 'price',
      className: 'price',
      render: (_, record) => <ZeroFormattedNumber value={record.price} fixed={record.price_fixed} />,
    }, {
      title: <FormattedMessage id="myorder_amount" />,
      dataIndex: 'amount',
      key: 'amount',
      className: 'amount',
      render: (_, record) => (
        <span>
          <ZeroFormattedNumber value={record.volume} fixed={record.amount_fixed} />
          {record.partial && (
            <span className="light-text"> / <ZeroFormattedNumber value={record.origin_volume} fixed={record.amount_fixed} /></span>
          )}
        </span>
      ),
    }, {
      title: <FormattedMessage id="myorder_opt" />,
      dataIndex: 'opt',
      key: 'opt',
      className: 'opt',
      render: (_, record) => <a onClick={() => this.handleDelete(record)}><FormattedMessage id="cancel" /></a>,
      mobileHideTitle: true,
    }];
  }
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
  processData() {
    const { data, basicInfo } = this.props;
    return data.map((row) => {
      const partial = row.volume !== row.origin_volume;
      const config = row.kind === 'bid' ? basicInfo.bid_config : basicInfo.ask_config;
      const date = new Date(row.at * 1000);
      return {
        partial,
        date,
        price_fixed: config.price_fixed,
        amount_fixed: config.amount_fixed,
        ...row,
      };
    });
  }
  render() {
    const { anonymous } = this.props;
    const data = this.processData();
    const cols = this.getCols();
    return (
      <div id="myOrders">
        <Table
          useMobileTable
          dataSource={data}
          columns={cols}
          pagination={false}
          size="small"
          rowKey={(_, i) => i}
        />
        {anonymous && (
          <Mask />
        )}
      </div>
    );
  }
}

function mapStateToProps({ account, market }) {
  return {
    data: account.orders,
    anonymous: account.anonymous,
    basicInfo: market.currentBasicInfo,
  };
}

export default connect(mapStateToProps)(injectIntl(MyOrders));
