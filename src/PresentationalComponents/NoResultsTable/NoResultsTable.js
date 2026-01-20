import React from 'react';
import propTypes from 'prop-types';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from '@patternfly/react-core';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';

const NoResultsTable = ({ type }) => (
  <EmptyTable>
    <Bullseye>
      <EmptyState  headingLevel="h5"   titleText={`No matching ${type} found`} variant={EmptyStateVariant.full}>
        <EmptyStateBody>
          To continue, edit your filter settings and search again.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  </EmptyTable>
);

export const emptyRows = (type) => {
  return [
    {
      cells: [
        {
          title: () => <NoResultsTable type={type} />, // eslint-disable-line
          props: {
            colSpan: 100,
          },
        },
      ],
    },
  ];
};

NoResultsTable.propTypes = {
  type: propTypes.string,
};

export default NoResultsTable;
