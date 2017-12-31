import React, { Component } from 'react';
import { connect } from 'dva';
import { injectIntl } from 'react-intl';

import './style.scss';

class MessageCenter extends Component {
  render() {
    const { messages } = this.props;
    console.log(messages);
    return (
      <div id="messageCenter">
        {messages.map((message, i) => (
          <div className="message-center-row" key={i}>
            {/* <span></span> */}
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
