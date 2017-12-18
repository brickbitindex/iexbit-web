import React, { Component } from 'react';
import classnames from 'classnames';
import autobind from 'autobind-decorator';
import Loading from '../loading';

import './style.scss';

const panelDefaultState = {
  title: undefined,
  show: true,
  loading: false,
};

export default function wrapWithPanel(C, defaultState) {
  const state = {
    ...panelDefaultState,
    ...defaultState,
  };

  return class WrappedPanelComponent extends Component {
    constructor(props) {
      super(props);
      this.state = state;
    }
    @autobind
    handleTitleChange(title) {
      this.setState({
        title,
      });
    }
    @autobind
    handleSlideClick() {
      this.setState({
        show: !this.state.show,
      });
    }
    render() {
      const { title, show, className, slideable } = this.state;
      const { loading } = this.props;
      return (
        <div className={classnames('cb-panel', className)}>
          {title && (
            <div className="cb-panel-title">
              {title}
              {slideable && (
                <span className="simple-btn" onClick={this.handleSlideClick}><i className={classnames('icon', 'anticon', `icon-${show ? 'down' : 'up'}`)} /></span>
              )}
            </div>
          )}
          <div className="cb-panel-content" style={{ display: show ? 'block' : 'none' }}>
            {loading ? (
              <Loading />
            ) : (
              <C {...this.props} onPanelTitleChange={this.handleTitleChange} />
            )}
          </div>
        </div>
      );
    }
  };
}
