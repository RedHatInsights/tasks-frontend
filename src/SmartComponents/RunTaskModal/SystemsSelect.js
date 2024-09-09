import { Title } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { useState } from 'react';
import SystemTable from '../SystemTable/SystemTable';
import { useSystemBulkSelect } from './hooks/useBulkSystemSelect';

const SystemsSelect = ({
  selectedIds,
  setSelectedIds,
  setShowEligibilityAlert,
  slug,
}) => {
  const [filterSortString, setFilterSortString] = useState('');

  const { bulkSelectIds, selectIds } = useSystemBulkSelect(
    selectedIds,
    setSelectedIds,
    filterSortString,
    slug
  );

  return (
    <>
      <Title headingLevel="h4">Systems to run tasks on</Title>
      <SystemTable
        bulkSelectIds={bulkSelectIds}
        selectedIds={selectedIds}
        selectIds={selectIds}
        setFilterSortString={setFilterSortString}
        setShowEligibilityAlert={setShowEligibilityAlert}
        slug={slug}
      />
    </>
  );
};

SystemsSelect.propTypes = {
  selectedIds: propTypes.array,
  setSelectedIds: propTypes.func,
  setShowEligibilityAlert: propTypes.func,
  slug: propTypes.string,
};

export default SystemsSelect;
