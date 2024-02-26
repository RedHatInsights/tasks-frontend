import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';
import {
  ELIGIBLE_SYSTEMS,
  ALL_SYSTEMS,
  eligibilityFilterItems,
  defaultOnLoad,
  systemColumns,
} from './constants';
import { useGetEntities } from './hooks';
import { findCheckedValue } from './helpers';

import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { Spinner } from '@patternfly/react-core';
import { RegistryContext } from '../../store';
import { useDispatch } from 'react-redux';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { generateFilter } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import usePromiseQueue from '../../Utilities/hooks/usePromiseQueue';

const SystemTable = ({
  bulkSelectIds,
  selectedIds,
  selectIds,
  setFilterSortString,
  slug,
}) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [eligibility, setEligibility] = useState(ELIGIBLE_SYSTEMS);
  const inventory = useRef(null);
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();
  const chrome = useChrome();
  const { resolve } = usePromiseQueue();

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

  useEffect(() => {
    inventory?.current?.onRefreshData();
  }, [eligibility]);

  const onComplete = (result) => {
    setTotal(result.meta.count);
    setItems(result.data);
  };

  const getEntities = useGetEntities(onComplete, {
    selectedIds,
    setFilterSortString,
    slug,
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

  const eligibilityFilter = {
    label: 'Task Eligibility',
    type: conditionalFilterType.radio,
    filterValues: {
      onChange: (event, value) => {
        setEligibility(value);
      },
      items: eligibilityFilterItems,
      value: eligibility,
      placeholder: 'Filter Eligible Systems',
    },
  };

  const activeFiltersConfig = {
    filters: [
      {
        id: 'Task eligibility',
        category: 'Task eligibility',
        chips: [{ name: eligibility, value: eligibility }],
      },
    ],
    onDelete: (event, itemsToRemove, isAll) => {
      if (isAll) {
        setEligibility(ELIGIBLE_SYSTEMS);
      } else {
        itemsToRemove.map((item) => {
          item.category === 'Task eligibility' && eligibility === ALL_SYSTEMS
            ? setEligibility(ELIGIBLE_SYSTEMS)
            : setEligibility(ALL_SYSTEMS);
        });
      }
    },
  };

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
        hostGroupFilter: false,
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
              bulkSelectIds('all', { total: total, resolve: resolve });
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
      filterConfig={{ items: [eligibilityFilter] }}
      activeFiltersConfig={activeFiltersConfig}
    />
  );
};

SystemTable.propTypes = {
  bulkSelectIds: propTypes.func,
  selectedIds: propTypes.array,
  selectIds: propTypes.func,
  setFilterSortString: propTypes.func,
  slug: propTypes.string,
};

export default SystemTable;
