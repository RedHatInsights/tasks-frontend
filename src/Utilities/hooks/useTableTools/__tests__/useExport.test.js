import { act, renderHook } from '@testing-library/react-hooks';
import columns from './__fixtures__/columns.fixtures';
import items from './__fixtures__/items.fixtures';
import useExport, { jsonForItems, csvForItems } from '../useExport';

describe('useExport', () => {
  let workingExporter = jest.fn(() => Promise.resolve(items));
  let defaultOptions;

  beforeEach(() => {
    defaultOptions = {
      columns,
    };
  });

  it('returns an export config toolbar config', () => {
    defaultOptions.exporter = workingExporter;
    const { result } = renderHook(() => useExport(defaultOptions));
    expect(result.current.toolbarProps.exportConfig).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('returns an export config toolbar config', () => {
    defaultOptions.exporter = workingExporter;
    const { result } = renderHook(() =>
      useExport({
        ...defaultOptions,
        isDisabled: true,
      })
    );
    expect(result.current.toolbarProps.exportConfig.isDisabled).toBe(true);
  });

  it('calls the exporter via onSelect', () => {
    defaultOptions.exporter = workingExporter;
    const { result } = renderHook(() => useExport(defaultOptions));

    act(() => {
      result.current.toolbarProps.exportConfig.onSelect(null, 'csv');
    });

    expect(defaultOptions.exporter).toHaveBeenCalled();

    act(() => {
      result.current.toolbarProps.exportConfig.onSelect(null, 'json');
    });

    expect(defaultOptions.exporter).toHaveBeenCalled();
  });
});

describe('jsonForItems', () => {
  it('returns an json export of items', () => {
    const result = jsonForItems({
      columns,
      items: items,
    });

    expect(result).toMatchSnapshot();
  });
});

describe('csvForItems', () => {
  it('returns an csv export of items', () => {
    const result = csvForItems({
      columns,
      items: items,
    });

    expect(result).toMatchSnapshot();
  });
});
