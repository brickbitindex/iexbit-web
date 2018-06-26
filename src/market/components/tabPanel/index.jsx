import React, { Component } from 'react';
import classnames from 'classnames';
import autobind from 'autobind-decorator';
import { FormattedMessage } from 'react-intl';
import Loading from '../loading';
import { Tabs } from '../../lib/antd';

import MyOrders from './components/myOrders';
import MessageCenter from './components/messageCenter';
import HistoryLog from './components/historyLog';

import './style.scss';

const TabPane = Tabs.TabPane;

export default class WrappedTabPanelComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      current: 'myOrders',
    };
  }
  @autobind
  handleTabClick(key) {
    this.setState({
      current: key,
    });
  }
  render() {
    const { current } = this.state;
    const { loadings } = this.props;
    const loading = loadings[current];
    const outerClassName = this.props.className;
    return (
      <div className={classnames('cb-panel cb-panel-tab', outerClassName, { loading })}>
        {/* <div className="cb-panel-title">
          <span className={classnames('cb-panel-tab-title', { active: current === keyMap.myOrders })} onClick={this.handleTabClick.bind(this, keyMap.myOrders)}>
            <FormattedMessage id="myorders" />
          </span>
          <span className={classnames('cb-panel-tab-title', { active: current === keyMap.messageCenter })} onClick={this.handleTabClick.bind(this, keyMap.messageCenter)}>
            <FormattedMessage id="messagecenter" />
          </span>
          {slideable && (
            <span className="simple-btn" onClick={this.handleSlideClick}><i className={classnames('anticon', `anticon-${show ? 'down' : 'up'}`)} /></span>
          )}
        </div>
        <div className="cb-panel-content cb-panel-tab-content" style={{ display: (show && current === keyMap.myOrders) ? 'block' : 'none' }}>
          {loading ? (
            <Loading />
          ) : (
            <MyOrders />
          )}
        </div>
        <div className="cb-panel-content cb-panel-tab-content" style={{ display: (show && current === keyMap.messageCenter) ? 'block' : 'none' }}>
          {loading ? (
            <Loading />
          ) : (
            <MessageCenter />
          )}
        </div> */}
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
          <TabPane key="historyLog" tab={<FormattedMessage id="history" />}>
            <HistoryLog />
          </TabPane>
        </Tabs>
        }
      </div>
    );
  }
}

