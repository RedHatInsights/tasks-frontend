import { emptyRows } from '../../../PresentationalComponents/NoResultsTable/NoResultsTable';
import { hasDetails } from '../../../SmartComponents/completedTaskDetailsHelpers';

const columnProp = (column) =>
  column.key ||
  column.original?.toLowerCase() ||
  column.sortByProp?.toLowerCase();

const itemRow = (item, columns, index) => ({
  ...item.rowProps,
  itemId: item.system,
  has_stdout: item.has_stdout,
  display_name: item.display_name,
  jobId: item.id,
  cells: columns.map((column) => ({
    title: column.renderFunc
      ? column.renderFunc(undefined, undefined, item, index)
      : item[columnProp(column)],
  })),
});

const buildRow = (item, columns, rowTransformer, index, parentIndex) => {
  return rowTransformer.flatMap((transformer) => {
    const row = itemRow(item, columns, index);
    return transformer
      ? transformer(row, item, columns, index, parentIndex)
      : row;
  });
};

const useRowsBuilder = (items, columns, options = {}) => {
  const { rowTransformer = [] } = options;
  const EmptyRowsComponent = options.emptyRows || emptyRows;

  const filteredItems = options?.filter ? options.filter(items) : items;

  const sortedItems = options?.sorter
    ? options.sorter(filteredItems)
    : filteredItems;

  const paginatedItems =
    options?.paginator && !options?.isTableLoading
      ? options?.paginator(filteredItems)
      : sortedItems;

  let parentIndex = -1;
  let row;

  const rows =
    paginatedItems.length > 0
      ? paginatedItems.flatMap((item, index) => {
          parentIndex += 1;
          row = buildRow(item, columns, rowTransformer, index, parentIndex);
          if (hasDetails(item)) {
            parentIndex += 1;
          }
          return row;
        })
      : EmptyRowsComponent;

  // Build pagination props, preserving custom itemCount for server-side pagination
  const pagination = options?.pagination
    ? {
        ...options.pagination,
        // Server-side pagination provides itemCount (total from API)
        // Client-side pagination uses filtered items length
        itemCount:
          options.pagination.itemCount !== undefined
            ? options.pagination.itemCount
            : filteredItems.length,
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
