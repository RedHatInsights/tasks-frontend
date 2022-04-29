import React from 'react';
import moment from 'moment';

const renderRunDateTime = (end) => {
  return end === 'null'
    ? 'Running'
    : moment.utc(end).format('DD MMM YYYY, HH:mm UTC');
};

const buildRow = (item, index) => [
  <div key={`task-title-${index}`}>
    <a href="beta/insights/tasks">{item.title}</a>
  </div>,
  item.system_count,
  renderRunDateTime(item.end),
];

const useRowsBuilder = (items, options = {}) => {
  const filteredItems = options?.filter ? options.filter(items) : items;

  const sortedItems = options?.sorter
    ? options.sorter(filteredItems)
    : filteredItems;

  const paginatedItems = options?.paginator
    ? options?.paginator(filteredItems)
    : sortedItems;

  const rows = paginatedItems.map((item, index) => buildRow(item, index));

  const pagination = options?.pagination
    ? {
        ...options.pagination,
        itemCount: filteredItems.length,
      }
    : undefined;

  return {
    tableProps: { rows },
    toolbarProps: {
      pagination,
    },
  };
};

export default useRowsBuilder;
