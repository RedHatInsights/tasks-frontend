import React from 'react';
import propTypes from 'prop-types';
import { Table, Tbody } from '@patternfly/react-table';
import { buildResultsRows } from './jobResultsDetailsHelpers';
import ExpandedIssues from './ExpandedIssues';

const JobResultsDetails = ({ taskSlug, item }) => {
  const isReportJson = item.results.report_json?.entries ? true : false;

  const rowPairs = isReportJson
    ? buildResultsRows(item.results.report_json.entries, isReportJson, taskSlug)
    : buildResultsRows([item.results.report], isReportJson, taskSlug);

  return (
    <div>
      <Table
        variant="compact"
        style={{
          marginBottom: '30px',
          '--pf-v5-c-table__expandable-row--after--border-width--base': '0',
        }}
      >
        <Tbody>
          <ExpandedIssues rowPairs={rowPairs} isReportJson={isReportJson} />
        </Tbody>
      </Table>
    </div>
  );
};

JobResultsDetails.propTypes = {
  item: propTypes.object,
  taskSlug: propTypes.string,
};

export default JobResultsDetails;
