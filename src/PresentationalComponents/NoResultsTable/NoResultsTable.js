import React from 'react';
import propTypes from 'prop-types';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';

const NoResultsTable = ({ type }) => (
  <EmptyTable>
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full}>
        <Title headingLevel="h5" size="lg">
          {`No matching ${type} found`}
        </Title>
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
