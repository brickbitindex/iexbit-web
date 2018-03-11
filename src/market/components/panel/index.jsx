import React, { Component } from 'react';
import classnames from 'classnames';
import autobind from 'autobind-decorator';
import Tooltip from 'rc-tooltip';
import { connect } from 'dva';
import Loading from '../loading';

import './style.scss';

const panelDefaultState = {
  title: undefined,
  show: true,
  loading: false,
};

function mapStateToProps(data) {
  return { data };
}

export default function wrapWithPanel(C, defaultState, defaultProps = {}, opts = []) {
  const state = {
    ...panelDefaultState,
    ...defaultState,
    ...defaultProps,
  };

  opts.reverse();

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
    render() {
      const { title, show, slideable } = this.state;
      const innerClassName = this.state.className;
      const { loading } = this.props;
      const outerClassName = this.props.className;

      const componentProps = {};
      Object.keys(defaultProps).forEach((k) => {
        componentProps[k] = this.state[k];
      });

      return (
        <div className={classnames('cb-panel', innerClassName, outerClassName, { loading, 'no-title': !title })}>
          {title && (
            <div className="cb-panel-title">
              {title}
              {slideable && (
                <span className="simple-btn" onClick={this.handleSlideClick}><i className={classnames('icon', 'anticon', `icon-${show ? 'down' : 'up'}`)} /></span>
              )}
              {opts.map((opt) => {
                let icon = opt.icon;
                if (typeof icon === 'function') {
                  icon = icon(componentProps, this.props.data, this.setChildProps);
                }
                let active = false;
                if (opt.active) {
                  active = opt.active(this.state);
                }
                const span = <span key={opt.key} className={classnames('simple-btn', { active }, opt.className)} onClick={() => opt.onClick(componentProps, this.setChildProps)}>{icon}</span>;
                if (opt.tooltip) {
                  return (
                    <Tooltip
                      prefixCls="rc-slider-tooltip"
                      overlay={opt.tooltip}
                      placement="top"
                      key={opt.key}
                    >
                      {span}
                    </Tooltip>
                  );
                }
                return span;
              })}
            </div>
          )}
          <div className="cb-panel-content" style={{ display: show ? 'block' : 'none' }}>
            {loading ? (
              <Loading />
            ) : (
              <C {...this.props} {...componentProps} />
            )}
          </div>
        </div>
      );
    }
  }
  return connect(mapStateToProps)(WrappedPanelComponent);
}
