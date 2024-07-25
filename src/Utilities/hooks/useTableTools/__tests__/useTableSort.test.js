import { act, renderHook } from '@testing-library/react-hooks';
import useTableSort, { useTableSortWithItems } from '../useTableSort';
import { taskColumnsFixtures as columns } from './__fixtures__/columns.fixtures';

describe('useTableSort', () => {
  it('returns a table sort configuration', () => {
    const { result } = renderHook(() => useTableSort(columns));
    expect(result).toMatchSnapshot();
  });

  it('returns a table sort configuration with an inital state', () => {
    const sortBy = {
      index: 3,
      direction: 'asc',
    };
    const { result } = renderHook(() =>
      useTableSort(columns, {
        sortBy,
      })
    );
    expect(result.current.tableProps.sortBy).toEqual(sortBy);
  });

  it('updates sortBy with onSort', () => {
    const sortBy = {
      index: 3,
      direction: 'asc',
    };
    const newSortBy = {
      index: 0,
      direction: 'desc',
    };

    const { result } = renderHook(() =>
      useTableSort(columns, {
        sortBy,
      })
    );

    act(() => {
      result.current.tableProps.onSort(null, 0, 'desc');
    });

    expect(result.current.tableProps.sortBy).toEqual(newSortBy);
  });
});

describe('useTableSortWithItems', () => {
  it('returns no sortBy when there are no items', () => {
    const sortBy = {
      index: 3,
      direction: 'asc',
    };
    const { result } = renderHook(() =>
      useTableSortWithItems([], columns, {
        sortBy,
      })
    );
    expect(result.current.tableProps.sortBy).toEqual(undefined);
  });
});
