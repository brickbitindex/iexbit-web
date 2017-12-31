import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { injectIntl } from 'react-intl';

import './style.scss';

class MessageCenter extends Component {
  render() {
    const { messages } = this.props;
    // console.log(messages);
    return (
      <div id="messageCenter">
        {messages.map((message, i) => (
          <div className="message-center-row" key={i}>
            <div className="message-time tt">{moment(message.time).format('HH:mm:ss')}</div>
            <div className="message-from tag">{message.from}</div>
            <div className="message-message">{message.message}</div>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps({ utils }) {
  return {
    messages: utils.messages,
  };
}

export default connect(mapStateToProps)(injectIntl(MessageCenter));
