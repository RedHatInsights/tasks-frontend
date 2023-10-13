import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';
import { defaultOnLoad, systemColumns } from './constants';
import { useGetEntities } from './hooks';
import { findCheckedValue } from './helpers';

import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Spinner } from '@patternfly/react-core';
import { RegistryContext } from '../../store';
import { useDispatch } from 'react-redux';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { generateFilter } from '@redhat-cloud-services/frontend-components-utilities/helpers';

const SystemTable = ({ bulkSelectIds, selectedIds, selectIds }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const inventory = useRef(null);
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();
  const chrome = useChrome();

  const tagsFilter = useSelector(
    ({ globalFilterState }) => globalFilterState?.tagsFilter
  );
  const workloadsFilter = useSelector(
    ({ globalFilterState }) => globalFilterState?.workloadsFilter
  );
  const sidsFilter = useSelector(
    ({ globalFilterState }) => globalFilterState?.sidsFilter
  );

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
    systemColumns(chrome?.isBeta?.()).map((column) => {
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
        tags: false,
        operatingSystem: false,
      }}
      columns={mergedColumns}
      ref={inventory}
      fallback={<Spinner />}
      onLoad={defaultOnLoad(systemColumns(chrome?.isBeta?.()), getRegistry)}
      customFilters={{
        tags: tagsFilter,
        workloadFilters: generateFilter(
          {
            system_profile: {
              ...(workloadsFilter?.SAP?.isSelected && { sap_system: true }),
              ...(workloadsFilter?.['Ansible Automation Platform']
                ?.isSelected && {
                ansible: {
                  not_nil: true,
                },
              }),
              ...(workloadsFilter?.['Microsoft SQL']?.isSelected && {
                mssql: {
                  not_nil: true,
                },
              }),
              ...(sidsFilter?.length > 0 && { sap_sids: sidsFilter }),
            },
          },
          undefined,
          { arrayEnhancer: 'contains' }
        ),
      }}
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
      showCentosVersions={true}
    />
  );
};

SystemTable.propTypes = {
  bulkSelectIds: propTypes.func,
  selectedIds: propTypes.array,
  selectIds: propTypes.func,
};

export default SystemTable;
