import React, { Component } from 'react';
import classnames from 'classnames';
import autobind from 'autobind-decorator';
import { connect } from 'dva';
import Loading from '../loading';

import './style.scss';

const panelDefaultState = {
  title: undefined,
  show: true,
  loading: false,
  titleContent: undefined,
};

function mapStateToProps(data) {
  return { data };
}

export default function wrapWithPanel(C, defaultState) {
  const state = {
    ...panelDefaultState,
    ...defaultState,
  };

  class WrappedPanelComponent extends Component {
    constructor(props) {
      super(props);
      this.state = state;
    }
    @autobind
    setChildProps(props) {
      this.setState(props);
    }
    @autobind
    handleSlideClick() {
      this.setState({
        show: !this.state.show,
      });
    }
    @autobind
    handleTitleContentChange(titleContent) {
      this.setState({
        titleContent,
      });
    }
    render() {
      const { title, show, slideable, titleContent } = this.state;
      const innerClassName = this.state.className;
      const { loading } = this.props;
      const outerClassName = this.props.className;


      return (
        <div className={classnames('cb-panel', innerClassName, outerClassName, { loading, 'no-title': !title })}>
          {title && (
            <div className="cb-panel-title">
              {title}
              {slideable && (
                <span className="simple-btn" onClick={this.handleSlideClick}><i className={classnames('icon', 'anticon', `icon-${show ? 'down' : 'up'}`)} /></span>
              )}
              {titleContent}
            </div>
          )}
          <div className="cb-panel-content" style={{ display: show ? 'block' : 'none' }}>
            {loading ? (
              <Loading />
            ) : (
              <C {...this.props} onTitleContentChange={this.handleTitleContentChange} />
            )}
          </div>
        </div>
      );
    }
  }
  return connect(mapStateToProps)(WrappedPanelComponent);
}
