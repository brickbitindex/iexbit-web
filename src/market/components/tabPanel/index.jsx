import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import { FormattedMessage } from 'react-intl';
import Loading from '../loading';
import { Tabs } from '../../lib/antd';

import MyOrders from './components/myOrders';
import MessageCenter from './components/messageCenter';
// import HistoryLog from './components/historyLog';

import './style.scss';

const TabPane = Tabs.TabPane;

class WrappedTabPanelComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      current: 'myOrders',
    };
  }
  componentDidMount() {
    const page = this.props.page;
    const currentUser = window.gon && window.gon.current_user;
    if (currentUser) setInterval(() => this.fetchHistoryLog({ page }), 30000);
  }
  @autobind
  handleTabClick(key) {
    this.setState({
      current: key,
    });
    if (key === 'historyLog') {
      const page = this.props.page;
      this.fetchHistoryLog({ page });
    }
  }
  fetchHistoryLog({ page }) {
    this.props.dispatch({
      type: 'account/queryHistoryLog',
      payload: {
        page,
      },
    });
  }
  render() {
    const { current } = this.state;
    const { loadings } = this.props;
    const loading = loadings[current];
    const outerClassName = this.props.className;
    return (
      <div className={classnames('cb-panel cb-panel-tab m-part-info', outerClassName, { loading })}>
        {loading ? <Loading /> :
        <Tabs
          activeKey={current}
          onChange={this.handleTabClick}
        >
          <TabPane key="myOrders" tab={<FormattedMessage id="myorders" />}>
            <MyOrders />
          </TabPane>
          <TabPane key="messageCenter" tab={<FormattedMessage id="messagecenter" />}>
            <MessageCenter />
          </TabPane>
          {/* <TabPane key="historyLog" tab={<FormattedMessage id="history" />}>
            <HistoryLog />
          </TabPane> */}
        </Tabs>
        }
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return {
    page: account.page,
  };
}

export default connect(mapStateToProps)(WrappedTabPanelComponent);

