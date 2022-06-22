import useRowsBuilder from './useRowsBuilder';
import useFilterConfig from './useFilterConfig';
import usePaginate from './usePaginate';
import { useExportWithItems } from './useExport';
import { useTableSortWithItems } from './useTableSort';

const filteredAndSortedItems = (items, filter, sorter) => {
  const filtered = filter ? filter(items) : items;
  return sorter ? sorter(filtered) : filtered;
};

const useTableTools = (items = [], columns = [], options = {}) => {
  const {
    toolbarProps: paginationToolbarProps,
    setPage,
    paginator,
  } = usePaginate(options);

  const {
    toolbarProps: conditionalFilterProps,
    filter,
    selectedFilterToolbarProps,
  } = useFilterConfig({
    ...options,
    setPage,
  });

  const { tableProps: sortableTableProps, sorter } = useTableSortWithItems(
    items,
    columns,
    options
  );

  const { toolbarProps: exportToolbarProps } = useExportWithItems(
    filteredAndSortedItems(items, filter, sorter),
    columns,
    options
  );

  const {
    toolbarProps: rowBuilderToolbarProps,
    tableProps: rowBuilderTableProps,
  } = useRowsBuilder(items, columns, {
    emptyRows: options.tableProps.emptyRows,
    pagination: paginationToolbarProps?.pagination,
    paginator,
    filter,
    sorter,
  });

  const toolbarProps = {
    ...paginationToolbarProps,
    ...conditionalFilterProps,
    ...selectedFilterToolbarProps,
    ...rowBuilderToolbarProps,
    ...exportToolbarProps,
  };

  const tableProps = {
    cells: columns,
    ...rowBuilderTableProps,
    ...sortableTableProps,
  };

  return {
    toolbarProps,
    tableProps,
  };
};

export default useTableTools;
