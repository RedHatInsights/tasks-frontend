import { act, renderHook } from '@testing-library/react';
import items from './__fixtures__/items.fixtures';
import useExport, {
  jsonForItems,
  csvForItems,
  useExportWithItems,
} from '../useExport';
import {
  fixturesExtendedReport,
  fixturesPlainReport,
} from './__fixtures__/jobResultsItems.fixtures';
import {
  jobCompleteColumnsFixtures,
  taskColumnsFixtures,
} from './__fixtures__/columns.fixtures';
import get from 'lodash/get';
import { linkAndDownload } from '../useExportHelpers';
import { waitFor } from '@testing-library/react';

jest.mock('../useExportHelpers');

describe('useExport', () => {
  let workingExporter = jest.fn(() => Promise.resolve(items));
  let defaultOptions;

  beforeEach(() => {
    defaultOptions = {
      columns: taskColumnsFixtures,
    };
  });

  it('returns an export config toolbar config', () => {
    defaultOptions.exporter = workingExporter;
    const { result } = renderHook(() => useExport(defaultOptions));
    expect(result.current.toolbarProps.exportConfig).toBeDefined();
    expect(result.current).toMatchSnapshot();
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
      columns: taskColumnsFixtures,
      items: items,
    });

    expect(result).toMatchSnapshot();
  });
});

describe('useExportWithItems', () => {
  it('calls prepareItems when export selected', () => {
    const prepareItemsMock = jest.fn();
    const { result } = renderHook(() =>
      useExportWithItems([], [], {
        exportable: { prepareItems: prepareItemsMock },
      })
    );

    expect(prepareItemsMock).not.toBeCalled();
    result.current.toolbarProps.exportConfig.onSelect();
    expect(prepareItemsMock).toBeCalled();
  });

  it('should add extra columns to the report', async () => {
    const { result } = renderHook(() =>
      useExportWithItems(
        [
          {
            ...fixturesExtendedReport,
            test_key1: 'success',
            test_key2: ['some', 'array', 1],
          },
        ],
        jobCompleteColumnsFixtures,
        {
          exportable: {
            extraExportColumns: [
              {
                title: 'Test 1',
                renderExport: (job) => get(job, 'test_key1', ''),
              },
              {
                title: 'Test 2',
                renderExport: (job) => get(job, 'test_key2', ''),
              },
            ],
          },
        }
      )
    );

    result.current.toolbarProps.exportConfig.onSelect(undefined, 'csv');
    await waitFor(() => {
      expect(linkAndDownload).toBeCalledWith(
        'data:text/csv;charset=utf-8,System%20name,Status,Message,Test%201,Test%202%0A%22System%2520deleted%22,%22Success%22,%22Completed%22,%22success%22,%22some,array,1%22',
        expect.anything()
      );
    });
  });
});

describe('csvForItems', () => {
  it('contains encoding metadata', () => {
    const result = csvForItems({
      columns: taskColumnsFixtures,
      items: items,
    });

    expect(result).toContain('data:text/csv;charset=utf-8');
  });

  it('returns some example csv export of items', () => {
    const result = csvForItems({
      columns: taskColumnsFixtures,
      items: items,
    });

    expect(result).toMatchSnapshot();
  });

  it('returns an csv export of items for complete job', () => {
    const result = csvForItems({
      columns: jobCompleteColumnsFixtures,
      items: [fixturesPlainReport],
    });

    expect(result).toMatchSnapshot();
  });
});
