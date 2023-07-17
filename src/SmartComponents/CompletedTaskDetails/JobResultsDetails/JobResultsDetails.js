import React from 'react';
import propTypes from 'prop-types';
import { TableComposable, Tbody } from '@patternfly/react-table';
import { buildResultsRows } from './jobResultsDetailsHelpers';
import ExpandedIssues from './ExpandedIssues';

const JobResultsDetails = ({ item }) => {
  const isReportJson = item.results.report_json ? true : false;

  const rowPairs = item.results.report_json
    ? buildResultsRows(item.results.report_json.entries, isReportJson)
    : buildResultsRows([item.results.report], isReportJson);

  return (
    <div>
      <TableComposable
        variant="compact"
        style={{
          marginBottom: '30px',
          '--pf-c-table__expandable-row--after--border-width--base': '0',
        }}
      >
        <Tbody>
          <ExpandedIssues rowPairs={rowPairs} isReportJson={isReportJson} />
        </Tbody>
      </TableComposable>
    </div>
  );
};

JobResultsDetails.propTypes = {
  item: propTypes.object,
};

export default JobResultsDetails;
