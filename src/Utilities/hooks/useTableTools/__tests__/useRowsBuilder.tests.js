import { renderHook } from '@testing-library/react-hooks';
import items from './__fixtures__/items.fixtures';
import { taskColumnsFixtures as columns } from './__fixtures__/columns.fixtures';
import useRowsBuilder from '../useRowsBuilder';

describe('useRowsBuilder', () => {
  it('returns a rows configuration', () => {
    const paginator = jest.fn((items) => items);

    const { result } = renderHook(() =>
      useRowsBuilder(items, columns, {
        rowTransformer: [undefined],
        isTableLoading: false,
        paginator: paginator,
      })
    );
    expect(paginator).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });

  it('doesnt paginate when the table is loading', () => {
    const paginator = jest.fn();
    renderHook(() =>
      useRowsBuilder(items, columns, {
        rowTransformer: [undefined],
        isTableLoading: true,
        paginator: paginator,
      })
    );
    expect(paginator).not.toHaveBeenCalled();
  });
});
