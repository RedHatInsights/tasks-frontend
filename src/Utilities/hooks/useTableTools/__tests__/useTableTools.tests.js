import { renderHook } from '@testing-library/react-hooks';
import useTableTools from '../useTableTools';
import items from './__fixtures__/items.fixtures';
import columns from './__fixtures__/columns.fixtures';

describe('useTableTools', () => {
  it('returns tableProps', () => {
    const { result } = renderHook(() => useTableTools(items, columns));
    expect(result).toMatchSnapshot();
    expect(result.current.tableProps.rows.length).toBe(2);
    expect(result.current.tableProps.cells.length).toBe(3);
  });

  it('should set default with no params', () => {
    const { result } = renderHook(() => useTableTools(undefined, undefined));
    expect(result.current.tableProps.rows.length).toBe(0);
    expect(result.current.tableProps.cells.length).toBe(0);
  });
});
