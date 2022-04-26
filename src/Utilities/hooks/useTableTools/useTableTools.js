import useRowsBuilder from './useRowsBuilder';

const useTableTools = (items = [], columns = []) => {
  const { tableProps: rowBuilderTableProps } = useRowsBuilder(items);

  const tableProps = {
    cells: columns,
    ...rowBuilderTableProps,
  };

  return {
    tableProps,
  };
};

export default useTableTools;
