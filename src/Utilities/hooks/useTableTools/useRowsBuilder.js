const columnProp = (column) =>
  column.key ||
  column.original?.toLowerCase() ||
  column.sortByProp?.toLowerCase();

const buildRow = (item, columns, index) =>
  columns.map((column) => ({
    title: column.renderFunc
      ? column.renderFunc(undefined, undefined, item, index)
      : item[columnProp(column)],
  }));

const useRowsBuilder = (items, columns, options = {}) => {
  const filteredItems = options?.filter ? options.filter(items) : items;

  const sortedItems = options?.sorter
    ? options.sorter(filteredItems)
    : filteredItems;

  const paginatedItems = options?.paginator
    ? options?.paginator(filteredItems)
    : sortedItems;

  const rows = paginatedItems.map((item, index) =>
    buildRow(item, columns, index)
  );

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
