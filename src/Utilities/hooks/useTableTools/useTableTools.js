import useRowsBuilder from './useRowsBuilder';
import useFilterConfig from './useFilterConfig';
import usePaginate from './usePaginate';
import { useExportWithItems } from './useExport';
import { useTableSortWithItems } from './useTableSort';
import { useActionResolverWithItems } from './useActionResolver';
import useExpandable from './useExpandable';

const filteredAndSortedItems = (items, filter, sorter) => {
  const filtered = filter ? filter(items) : items;
  return sorter ? sorter(filtered) : filtered;
};

const useTableTools = (
  items = [],
  columns = [],
  options = {},
  isTableLoading
) => {
  const {
    toolbarProps: paginationToolbarProps,
    setPage,
    paginator,
  } = usePaginate(options, isTableLoading);

  const {
    toolbarProps: conditionalFilterProps,
    filter,
    selectedFilterToolbarProps,
  } = useFilterConfig({
    ...options,
    setPage,
  });

  const { transformer: openItem, tableProps: expandableProps } =
    useExpandable(options);

  const { tableProps: sortableTableProps, sorter } = useTableSortWithItems(
    items,
    columns,
    options
  );

  const { tableProps: actionResolverTableProps } = useActionResolverWithItems({
    items: filteredAndSortedItems(items, filter, sorter),
    ...options,
  });

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
    rowTransformer: [openItem],
    pagination: paginationToolbarProps?.pagination,
    paginator,
    filter,
    sorter,
    isTableLoading,
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
    ...expandableProps,
    ...actionResolverTableProps,
  };

  return {
    toolbarProps,
    tableProps,
  };
};

export default useTableTools;
