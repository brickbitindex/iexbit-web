import React, { Component } from 'react';

import './style.scss';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frame: 0,
    };
  }
  componentDidMount() {
    this.handler = setInterval(() => {
      this.setState({
        frame: (this.state.frame + 1) % 3,
      });
    }, 200);
  }
  componentWillUnmount() {
    clearInterval(this.handler);
  }
  render() {
    return (
      <div className="loading-container">
        <div className={`loading-logo frame${this.state.frame}`} />
      </div>
    );
  }
}
