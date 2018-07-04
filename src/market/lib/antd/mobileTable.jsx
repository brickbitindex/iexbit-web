import React from 'react';
import classnames from 'classnames';

import './mobileTable.scss';

function processData({ dataSource, columns }) {
  const data = dataSource.map(d => columns.map(col => ({
    title: col.mobileHideTitle ? undefined : col.title,
    className: col.className,
    value: col.render ? col.render(d[col.dataIndex], d) : d[col.dataIndex],
    key: col.dataIndex || col.key,
  })));
  return data;
}

export default function MobileTable(props) {
  const data = processData(props);
  return (
    <div className={classnames('mobile-table', props.className)}>
      {data.length === 0 && (
        <div className="mobile-table-empty">No Data</div>
      )}
      {data.map((d, i) => (
        <div className="mobile-table-block" key={i}>
          {d.map(dd => (
            <div className={classnames('mobile-table-row', dd.className)} key={dd.key}>
              <div className="mobile-table-row-title">{dd.title}</div>
              <div className="mobile-table-row-value">{dd.value}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
