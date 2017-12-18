import React from 'react';
import img from '../../../assets/images/logo_icon.svg';

import './style.scss';

export default function Loading() {
  return (
    <div className="loading-container">
      <img src={img} alt="loading" />
    </div>
  );
}
