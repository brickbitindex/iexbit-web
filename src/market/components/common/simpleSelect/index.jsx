import React from 'react';
import './style.scss';

export default function SimpleSelect(props) {
  // console.log('props', props);
  return (
    <span className="simple-select">
      <select {...props}>{props.children}</select>
    </span>
  );
}
