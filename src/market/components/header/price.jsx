import React from 'react';
import classnames from 'classnames';

function goto(name) {
  window.location = `/markets/${name.replace('/', '_').toLowerCase()}`;
}

function highlight(name, highlightReg) {
  const match = name.match(highlightReg);
  if (!match) {
    return name;
  }
  const index = match.index;
  const p0 = name.substr(0, index);
  const p1 = name.substr(index, match[0].length);
  const p2 = name.substr(index + match[0].length);
  return (
    <span>{p0}<span className="highlight">{p1}</span>{p2}</span>
  );
}

export default function Price(props) {
  const price = props.data;
  const highlightReg = props.highlightReg;
  const down = price.down;
  const name = price.name;
  return (
    <div className="header-price simple-btn" onClick={goto.bind(null, name)}>
      <div className="header-price-name">
        {highlightReg ? highlight(name, highlightReg) : name}
      </div>
      <div className="header-price-current">
        <span>{price.last} {/* price.quote_unit.toUpperCase() */}</span>
        <span className={classnames(down ? 'red-text' : 'green-text')}>
          ({down ? '-' : '+'}{Math.abs(price.change * 100).toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
