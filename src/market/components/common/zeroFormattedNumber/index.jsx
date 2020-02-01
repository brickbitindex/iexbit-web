import React from 'react';

const reg = /0+$/;

function ZeroFormattedNumber(props) {
  const { value, fixed } = props;
  let ret = value;
  if (fixed >= 0) {
    ret = parseFloat(value).toFixed(fixed);
  }
  const zero = ret.match(reg);
  if (zero) {
    // return <span>{ret.slice(0, zero.index)}<span className="light-text">{zero[0]}</span></span>;
    return <span>{ret.slice(0, zero.index)}{zero[0]}</span>;
  }
  return <span>{ret}</span>;
}

export default ZeroFormattedNumber;
