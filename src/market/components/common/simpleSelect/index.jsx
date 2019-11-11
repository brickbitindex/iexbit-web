import React from 'react';
import './style.scss';

export default function SimpleSelect(props) {
  return (
    <span className="simple-select">
      <select {...props}>{props.children}</select>
    </span>
  );
}
