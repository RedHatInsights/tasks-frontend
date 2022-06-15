import React, { useContext, useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { defaultOnLoad, systemColumns } from './constants';
import { useGetEntities } from './hooks';

import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Spinner } from '@patternfly/react-core';
import { RegistryContext } from '../../store';
import { useDispatch } from 'react-redux';

const SystemTable = ({ selectedIds, selectIds }) => {
  const inventory = useRef(null);
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'INVENTORY_INIT' });
    dispatch({ type: 'RESET_PAGE' });
    inventory?.current?.onRefreshData();
  }, [dispatch]);

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
        //name: false,
        //tags: false,
        //operatingSystem: false,
      }}
      columns={mergedColumns}
      ref={inventory}
      fallback={<Spinner />}
      onLoad={defaultOnLoad(systemColumns, getRegistry)}
      getEntities={useGetEntities(selectedIds)}
      tableProps={{
        canSelectAll: false,
        isStickyHeader: true,
        onSelect: selectIds,
      }}
    />
  );
};

SystemTable.propTypes = {
  selectedIds: propTypes.array,
  selectIds: propTypes.func,
};

export default SystemTable;
