import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';


import { Table } from '../../../../lib/antd';
import './style.scss';

const trades = [{
  title: <FormattedMessage id="history_table_trades_side" />,
  dataIndex: 'side',
  key: 'side',
  render: text => <span className={text === 'sell' ? 'red-text' : 'green-text'}><FormattedMessage id={`history_table_trades_side_${text}`} /></span>,
}, {
  title: <FormattedMessage id="history_table_trades_created_at" />,
  dataIndex: 'created_at',
  key: 'created_at',
  render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
}, {
  title: <FormattedMessage id="history_table_trades_base" />,
  dataIndex: 'base_unit_code',
  key: 'base_unit_code',
  render: (text, record) => record.base_unit_code + '/' + record.base_unit_volume,
}, {
  title: <FormattedMessage id="history_table_trades_quete" />,
  dataIndex: 'quete_unit_code',
  key: 'quete_unit_code',
  render: (text, record) => record.quete_unit_code + '/' + record.quete_unit_volume,
}, {
  title: <FormattedMessage id="history_table_trades_price" />,
  dataIndex: 'price',
  key: 'price',
}, {
  title: <FormattedMessage id="history_table_trades_fee" />,
  dataIndex: 'fee',
  key: 'fee',
}];

class HistoryLog extends Component {
  render() {
    const { historyLogs, historyPage } = this.props;
    const paginationProps = {
      total: historyPage.total,
    };
    return (
      <div id="historyLog">
        <Table
          dataSource={historyLogs}
          columns={trades}
          pagination={paginationProps}
        />
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return {
    historyLogs: account.historyLogs,
    historyPage: account.historyPage,
  };
}

export default connect(mapStateToProps)(HistoryLog);
