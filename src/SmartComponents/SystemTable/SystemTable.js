import React, { useContext, useEffect, useRef, useState } from 'react';
import propTypes from 'prop-types';
import { defaultOnLoad, systemColumns } from './constants';
import { useGetEntities } from './hooks';
import { findCheckedValue } from './helpers';

import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Spinner } from '@patternfly/react-core';
import { RegistryContext } from '../../store';
import { useDispatch } from 'react-redux';

const SystemTable = ({ bulkSelectIds, selectedIds, selectIds }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const inventory = useRef(null);
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'INVENTORY_INIT' });
    dispatch({ type: 'RESET_PAGE' });
    inventory?.current?.onRefreshData();
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'SELECT_ENTITIES',
      payload: {
        selected: selectedIds,
      },
    });
  }, [selectedIds]);

  const onComplete = (result) => {
    setTotal(result.meta.count);
    setItems(result.data);
  };

  const getEntities = useGetEntities(onComplete, {
    selectedIds,
  });

  const mergedColumns = (defaultColumns) =>
    systemColumns.map((column) => {
      const isStringCol = typeof column === 'string';
      const key = isStringCol ? column : column.key;
      const defaultColumn = defaultColumns.find(
        (defaultCol) => defaultCol.key === key
      );
      return {
        ...defaultColumn,
        ...(isStringCol ? { key: column } : column),
        props: {
          ...defaultColumn?.props,
          ...column?.props,
        },
      };
    });

  return (
    <InventoryTable
      isFullView
      autoRefresh
      initialLoading
      showTags
      hideFilters={{
        all: true,
        name: false,
        //tags: false,
        operatingSystem: false,
      }}
      columns={mergedColumns}
      ref={inventory}
      fallback={<Spinner />}
      onLoad={defaultOnLoad(systemColumns, getRegistry)}
      getEntities={getEntities}
      bulkSelect={{
        id: 'systems-bulk-select',
        isDisabled: !total,
        count: selectedIds.length,
        items: [
          {
            title: `Select none (0)`,
            onClick: () => {
              bulkSelectIds('none');
            },
          },
          {
            title: `Select page (${items?.length || 0})`,
            onClick: () => {
              bulkSelectIds('page', { items: items });
            },
          },
          {
            title: `Select all (${total || 0})`,
            onClick: () => {
              bulkSelectIds('all', { total: total });
            },
          },
        ],
        onSelect: () => {
          if (selectedIds.length) {
            bulkSelectIds('none');
          } else {
            bulkSelectIds('all', { total: total });
          }
        },
        checked:
          items && selectedIds
            ? findCheckedValue(total, selectedIds.length)
            : null,
      }}
      tableProps={{
        canSelectAll: false,
        isStickyHeader: true,
        onSelect: items.length ? selectIds : null,
      }}
    />
  );
};

SystemTable.propTypes = {
  bulkSelectIds: propTypes.func,
  selectedIds: propTypes.array,
  selectIds: propTypes.func,
};

export default SystemTable;
