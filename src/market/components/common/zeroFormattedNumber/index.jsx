import React from 'react';
import { injectIntl } from 'react-intl';

const reg = /0+$/;

function C(props) {
  const { value, fixed } = props;
  const formatNumber = props.intl.formatNumber;
  const ret = formatNumber(value, {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  });
  const zero = ret.match(reg);
  if (zero) {
    return <span>{ret.slice(0, zero.index)}<span className="light-text">{zero[0]}</span></span>;
  }
  return <span>{ret}</span>;
}

export default injectIntl(C);
