import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { camelCase, getProperty } from '../../helpers';
import { encodeCsvCell } from './reportParser';

const CSV_FILE_PREFIX = 'tasks-export';
const CSV_DELIMITER = ',';

const filename = () => CSV_FILE_PREFIX + '-' + new Date().toISOString();

const textForCell = (row, column) => {
  const { exportKey, renderExport } = column;
  let cell = exportKey ? getProperty(row, exportKey) : row;
  if (renderExport) {
    return renderExport(cell);
  } else {
    return cell;
  }
};

export const csvForItems = ({ items, columns }) => {
  const header = columns
    .map((column) => column.original || column.title)
    .join(CSV_DELIMITER);
  const csvRows = [
    header,
    ...items.map((row) =>
      columns
        .map((column) => encodeCsvCell(textForCell(row, column)))
        .join(CSV_DELIMITER)
    ),
  ];

  return csvRows.join('\n');
};

export const jsonForItems = ({ items, columns }) => {
  const result = items.map((row) =>
    columns.reduce((object, column) => {
      const key = camelCase(column.original || column.title);
      const value = textForCell(row, column);

      object[key] = value;
      return object;
    }, {})
  );

  return JSON.stringify(result);
};

const callCallback = (callback, ...args) => callback && callback(...args);

const useExport = ({
  exporter,
  columns = [],
  isDisabled = false,
  onStart,
  onComplete,
  onError,
}) => {
  const exportableColumns = columns.filter(
    (column) =>
      column.export !== false && (column.exportKey || column.renderExport)
  );
  const exportWithFormat = async (format) => {
    callCallback(onStart);
    const items = await exporter()
      .then((items) => {
        callCallback(onComplete, items);
        return items;
      })
      .catch((error) => callCallback(onError, error));

    const formater = format === 'csv' ? csvForItems : jsonForItems;

    if (items) {
      downloadFile(
        formater({
          items,
          columns: exportableColumns,
        }),
        filename(),
        format
      );
    } else {
      console.info('No items returned for export');
    }
  };

  return {
    toolbarProps: {
      exportConfig: {
        isDisabled,
        onSelect: (_, format) => exportWithFormat(format),
      },
    },
  };
};

export const useExportWithItems = (items, columns, options = {}) => {
  const exportEnabled = options?.exportable;
  const {
    columns: exportableColumns,
    onStart,
    onComplete,
    prepareItems,
    extraExportColumns = [],
  } = typeof options.exportable === 'object' ? options.exportable : {};

  const exportableSelectedColumns = (exportableColumns || columns).filter(
    (column) => columns.includes(column)
  );

  const exportProps = useExport({
    exporter: () => Promise.resolve(prepareItems ? prepareItems(items) : items),
    columns: exportableSelectedColumns.concat(extraExportColumns),
    isDisabled: items.length === 0,
    onStart,
    onComplete,
  });

  return exportEnabled ? exportProps : {};
};

export default useExport;
