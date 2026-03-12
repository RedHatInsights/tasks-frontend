import React from 'react';
import propTypes from 'prop-types';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import { NO_RESULTS_MAP, NO_RESULTS_REASONS } from '../../constants';

const NoResultsTable = ({
  type,
  titleText,
  reason = NO_RESULTS_REASONS.NO_MATCH,
}) => (
  <EmptyTable style={{ margin: 0 }}>
    <Bullseye>
      <EmptyState
        variant={EmptyStateVariant.sm}
        icon={NO_RESULTS_MAP[reason]?.icon || SearchIcon}
        titleText={
          titleText ||
          NO_RESULTS_MAP[reason]?.titleText ||
          `No matching ${type} found`
        }
        headingLevel="h5"
      >
        <EmptyStateBody>
          {NO_RESULTS_MAP[reason]?.bodyText ||
            'To continue, edit your filter settings and search again.'}
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  </EmptyTable>
);

export const emptyRows = (type, titleText, reason) => {
  return [
    {
      cells: [
        {
          title: () => (
            <NoResultsTable type={type} titleText={titleText} reason={reason} />
          ), // eslint-disable-line
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
  titleText: propTypes.string,
  reason: propTypes.oneOf(Object.values(NO_RESULTS_REASONS)),
};

export default NoResultsTable;
