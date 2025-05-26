import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';
import {
  ELIGIBLE_SYSTEMS_VALUE,
  ALL_SYSTEMS_VALUE,
  API_MAX_SYSTEMS,
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
import { generateFilter } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import usePromiseQueue from '../../Utilities/hooks/usePromiseQueue';
import { NoCentOsEmptyState } from './NoCentOsEmptyState';
import { CENTOS_CONVERSION_SLUGS } from '../AvailableTasks/QuickstartButton';

const SystemTable = ({
  bulkSelectIds,
  selectedIds,
  selectIds,
  setFilterSortString,
  setShowEligibilityAlert,
  slug,
}) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [eligibility, setEligibility] = useState(eligibilityFilterItems[0]);
  const inventory = useRef(null);
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();
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
    systemColumns(slug).map((column) => {
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

  const setEligibilityData = (value) => {
    setEligibility(value);
    setShowEligibilityAlert(value === ELIGIBLE_SYSTEMS_VALUE);
  };

  const eligibilityFilter = {
    label: 'Task eligibility',
    type: 'singleSelect',
    filterValues: {
      value: eligibility.value,
      items: eligibilityFilterItems,
      onChange: (_event, selectedValues) => {
        setEligibilityData(
          eligibilityFilterItems.find(({ value }) => value === selectedValues)
        );
      },
    },
  };

  const activeFiltersConfig = {
    filters:
      eligibility.value === ELIGIBLE_SYSTEMS_VALUE
        ? [
            {
              id: 'Task eligibility',
              category: 'Task eligibility',
              chips: [{ name: eligibility.label, value: eligibility.value }],
            },
          ]
        : [],
    onDelete: (event, itemsToRemove, isAll) => {
      if (isAll) {
        setEligibility(eligibilityFilterItems[0]);
        setShowEligibilityAlert(true);
      } else {
        itemsToRemove.map((item) => {
          if (item.category === 'Task eligibility') {
            if (eligibility === ALL_SYSTEMS_VALUE) {
              setEligibility(eligibilityFilterItems[0]);
              setShowEligibilityAlert(true);
            } else {
              setEligibility(eligibilityFilterItems[1]);
              setShowEligibilityAlert(false);
            }
          }
        });
      }
    },
  };

  const buildBulkSelectItems = () => {
    const bulkSelectItems = [
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
    ];

    // 'Select all' option removed when more than API_MAX_SYSTEMS due to
    // performance and accuracy issues in the API when selecting many systems.
    // It's not fixable in the Tasks API yet either, otherwise we would!
    if (total <= API_MAX_SYSTEMS) {
      bulkSelectItems.push({
        title: `Select all (${total || 0})`,
        onClick: () => {
          bulkSelectIds('all', { total: total, resolve: resolve });
        },
      });
    }

    return bulkSelectItems;
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
      onLoad={defaultOnLoad(systemColumns(slug), getRegistry)}
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
        items: buildBulkSelectItems(),
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
      {...(CENTOS_CONVERSION_SLUGS.includes(slug)
        ? { noSystemsTable: <NoCentOsEmptyState slug={slug} /> }
        : {})}
    />
  );
};

SystemTable.propTypes = {
  bulkSelectIds: propTypes.func,
  selectedIds: propTypes.array,
  selectIds: propTypes.func,
  setFilterSortString: propTypes.func,
  setShowEligibilityAlert: propTypes.func,
  slug: propTypes.string,
};

export default SystemTable;
