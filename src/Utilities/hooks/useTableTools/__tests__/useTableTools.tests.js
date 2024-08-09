import { renderHook } from '@testing-library/react-hooks';
import useTableTools from '../useTableTools';
import items from './__fixtures__/items.fixtures';
import { taskColumnsFixtures as columns } from './__fixtures__/columns.fixtures';

describe('useTableTools', () => {
  let options = {
    tableProps: {
      emptyRows: [],
    },
  };

  it('returns tableProps', () => {
    const { result } = renderHook(() => useTableTools(items, columns, options));
    expect(result).toMatchSnapshot();
    expect(result.current.tableProps.rows.length).toBe(4);
    expect(result.current.tableProps.cells.length).toBe(3);
  });

  it('should set default with no params', () => {
    const { result } = renderHook(() =>
      useTableTools(undefined, undefined, options)
    );
    expect(result.current.tableProps.rows.length).toBe(0);
    expect(result.current.tableProps.cells.length).toBe(0);
  });
});
