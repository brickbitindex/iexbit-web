import React from 'react';

import './style.scss';

export default function Tooltip(props) {
  return (
    <div className="tooltip">
      <div className="tooltip-content">
        <div className="tooltip-arrow" />
        <div className="tooltip-inner">
          {props.text}
        </div>
      </div>
    </div>
  );
}
