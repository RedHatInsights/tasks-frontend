import { renderHook } from '@testing-library/react-hooks';
import items from './__fixtures__/items.fixtures';
import columns from './__fixtures__/columns.fixtures';
import useRowsBuilder from '../useRowsBuilder';

describe('useRowsBuilder', () => {
  it('returns a rows configuration', () => {
    const { result } = renderHook(() =>
      useRowsBuilder(items, columns, {
        rowTransformer: [undefined],
      })
    );
    expect(result).toMatchSnapshot();
  });
});
