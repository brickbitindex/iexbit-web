import React from 'react';
import classnames from 'classnames';

import './style.scss';

export default function Tooltip(props) {
  return (
    <div className={classnames('tooltip', props.placement)}>
      <div className="tooltip-content">
        <div className="tooltip-arrow" />
        <div className="tooltip-inner">
          {props.text}
        </div>
      </div>
    </div>
  );
}
