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
      const { title, show, slideable } = this.state;
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

export function wrapWithTabPanel(CObjs, defaultState) {
  const _CKeys = Object.keys(CObjs);
  const _Cs = _CKeys.map(k => CObjs[k].C);
  const _titles = _CKeys.map(k => CObjs[k].title);
  const state = {
    ...panelDefaultState,
    currentKey: '',
    CKeys: _CKeys,
    Cs: _Cs,
    titles: _titles,
    ...defaultState,
  };


  return class WrappedTabPanelComponent extends Component {
    constructor(props) {
      super(props);
      this.state = state;
    }
    handleTitleChange(index, title) {
      const titles = [...this.state.titles];
      titles[index] = title;
      this.setState({
        titles,
      });
    }
    @autobind
    handleSlideClick() {
      this.setState({
        show: !this.state.show,
      });
    }
    handleTabClick(index) {
      const key = this.state.CKeys[index];
      if (key === this.state.currentKey) return;
      this.setState({
        currentKey: key,
      });
    }
    render() {
      const { show, slideable, currentKey, Cs, CKeys, titles } = this.state;
      const { loadings } = this.props;
      const loading = loadings[currentKey];
      const currentIndex = CKeys.indexOf(currentKey);
      const outerClassName = this.props.className;
      return (
        <div className={classnames('cb-panel cb-panel-tab', outerClassName, { loading })}>
          <div className="cb-panel-title">
            {titles.map((title, i) => (
              <span className={classnames('cb-panel-tab-title', { active: i === currentIndex })} key={i} onClick={this.handleTabClick.bind(this, i)}>{title}</span>
            ))}
            {slideable && (
              <span className="simple-btn" onClick={this.handleSlideClick}><i className={classnames('icon', 'anticon', `icon-${show ? 'down' : 'up'}`)} /></span>
            )}
          </div>
          {Cs.map((C, i) => (
            <div className="cb-panel-content cb-panel-tab-content" style={{ display: (show && i === currentIndex) ? 'block' : 'none' }} key={i}>
              {loading ? (
                <Loading />
              ) : (
                <C {...this.props} onPanelTitleChange={this.handleTitleChange.bind(this, i)} />
              )}
            </div>
          ))}
        </div>
      );
    }
  };
}

