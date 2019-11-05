import React, { Component } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
// import moment from 'moment';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { injectIntl, FormattedMessage, FormattedTime, FormattedDate } from 'react-intl';
import ZeroFormattedNumber from '../../../common/zeroFormattedNumber';

import Mask from '../../../common/anonymousMask';

import { Table, Button, Popconfirm } from '../../../../lib/antd';

import './style.scss';

const reg = /0+$/;

class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
    };
  }
  componentWillReceiveProps(props) {
    const data = props.data;
    const waitLen = data.filter(d => d.state === 'wait').length;
    if (waitLen) this.setState({ disabled: false });
    else this.setState({ disabled: true });
  }
  getCols() {
    return [{
      title: <FormattedMessage id="myorder_type" />,
      dataIndex: 'kind',
      key: 'kind',
      className: 'kind',
      render: (text, record) => {
        console.log('text', text);
        console.log('record', record);
        return (text === 'ask' ? <span className="red-text"><FormattedMessage id="order_sell" />(<FormattedMessage id={`order_type_${record.ord_type}`} />)</span> : <span className="green-text"><FormattedMessage id="order_buy" />(<FormattedMessage id={`order_type_${record.ord_type}`} />) </span>);
      },
    }, {
    //   title: <FormattedMessage id="myorder_type" />,
    //   dataIndex: 'type',
    //   key: 'type',
    //   className: 'type',
    //   render: () => <FormattedMessage id="order_type_limit" />,
    // }, {
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
  @autobind
  handleCancelAll() {
    const marketId = $('body').attr('data-market_id');
    this.props.dispatch({
      type: 'account/clearOrders',
      payload: {
        market_id: marketId,
      },
    });
  }
  render() {
    const { anonymous, i18n } = this.props;
    const { disabled } = this.state;
    const data = this.processData();
    const cols = this.getCols();
    return (
      <div id="myOrders">
        <div className="text-right">
          <Popconfirm
            overlayClassName="myorders-pop"
            onConfirm={this.handleCancelAll}
            title={i18n.myorder_cancel_all_confirm}
            okText={i18n.order_tips_ok}
            cancelText={i18n.order_tips_cancel}
          >
            <Button size="small" disabled={disabled}><FormattedMessage id="myorder_cancel_all" /></Button>
          </Popconfirm>
        </div>
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

function mapStateToProps({ account, market, i18n }) {
  return {
    data: account.orders,
    anonymous: account.anonymous,
    basicInfo: market.currentBasicInfo,
    i18n: i18n.messages,
  };
}

export default connect(mapStateToProps)(injectIntl(MyOrders));
