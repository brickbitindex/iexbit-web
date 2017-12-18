import React from 'react';
import classnames from 'classnames';

export default function Price(props) {
  const price = props.data;
  const change = (parseFloat(price.last) - price.open) / price.open;
  const down = change < 0;
  return (
    <div className="header-price">
      <div className="header-price-name">{price.name}</div>
      <div className="header-price-current">
        <span>{price.last} {price.quote_unit.toUpperCase()}</span>
        <span>&nbsp;</span>
        <span className={classnames(down ? 'red-text' : 'green-text')}>
          ({down ? '-' : '+'}{Math.abs(change * 100).toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
