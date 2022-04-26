import React from 'react';

const buildRow = (item, index) => [
  <div key={`task-title-${index}`}>
    <a href="beta/insights/tasks">{item.title}</a>
  </div>,
  item.system_count,
  item.start,
];

const useRowsBuilder = (items) => {
  const rows = items.map((item, index) => buildRow(item, index));

  return {
    tableProps: { rows },
  };
};

export default useRowsBuilder;
