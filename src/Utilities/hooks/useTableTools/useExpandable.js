import React, { useState } from 'react';
import { hasDetails } from '../../../SmartComponents/completedTaskDetailsHelpers';

const buildExpandableRows = (
  item,
  row,
  rowIndex,
  options,
  columns,
  isOpen,
  parentIndex
) => {
  let newRow;

  if (hasDetails(item)) {
    newRow = {
      ...row,
      isOpen,
    };

    const expandableRow = itemDetailsRow(
      item,
      rowIndex,
      options,
      columns,
      parentIndex
    );

    return [newRow, expandableRow];
  } else {
    return [row];
  }
};

const calculateColSpan = (columns, options) => {
  let colSpan = columns.length + 1;
  if (options.selectable || options.hasRadioSelect) {
    colSpan++;
  }
  return colSpan;
};

const childRowForJob = (item, idx, DetailsComponent, colSpan, parentIndex) => ({
  parent: parentIndex,
  fullWidth: true,
  cells: [
    {
      title: <DetailsComponent item={item} key={'item-' + item.system} />,
      props: { colSpan },
    },
  ],
});

const itemDetailsRow = (item, idx, options, columns, parentIndex) =>
  typeof options?.detailsComponent !== 'undefined' &&
  childRowForJob(
    item,
    idx,
    options.detailsComponent,
    calculateColSpan(columns, options),
    parentIndex
  );

const useExpandable = (options) => {
  const enableExpandable = !!options.detailsComponent;
  const [openItems, setOpenItems] = useState([]);
  const onCollapse = (_event, _index, _isOpen, row) => {
    if (openItems.includes(row.itemId)) {
      setOpenItems(openItems.filter((itemId) => itemId !== row.itemId));
    } else {
      setOpenItems([...openItems, row.itemId]);
    }
  };

  const openItem = (row, item, columns, rowIndex, parentIndex) => {
    const isOpen = openItems.includes(item.system);
    let newRow = buildExpandableRows(
      item,
      row,
      rowIndex,
      options,
      columns,
      isOpen,
      parentIndex
    );

    return newRow;
  };

  return enableExpandable
    ? {
        transformer: openItem,
        tableProps: {
          onCollapse,
        },
      }
    : {};
};

export default useExpandable;
