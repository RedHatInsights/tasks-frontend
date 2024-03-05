import React from 'react';
import propTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { Table, Tbody } from '@patternfly/react-table';
import { buildResultsRows } from './jobResultsDetailsHelpers';
import ExpandedIssues from './ExpandedIssues';

const JobResultsDetails = ({
  taskSlug,
  item,
  setIsLogDrawerExpanded,
  setJobName,
  setJobId,
}) => {
  const isReportJson = item.results.report_json?.entries ? true : false;

  const rowPairs = isReportJson
    ? buildResultsRows(item.results.report_json.entries, isReportJson, taskSlug)
    : buildResultsRows([item.results.report], isReportJson, taskSlug);

  const handleViewLogs = (id, jobName) => {
    setIsLogDrawerExpanded(true);
    setJobId(id);
    setJobName(jobName);
  };

  return (
    <div>
      <Table
        variant="compact"
        style={{
          marginBottom: '16px',
          '--pf-v5-c-table__expandable-row--after--border-width--base': '0',
        }}
      >
        <Tbody>
          <ExpandedIssues rowPairs={rowPairs} isReportJson={isReportJson} />
        </Tbody>
      </Table>
      {item.has_stdout && (
        <Button
          style={{ paddingLeft: '32px', paddingBottom: '16px' }}
          variant="link"
          isInline
          onClick={() => handleViewLogs(item.id, item.display_name)}
        >
          View logs
        </Button>
      )}
    </div>
  );
};

JobResultsDetails.propTypes = {
  item: propTypes.object,
  setIsLogDrawerExpanded: propTypes.func,
  setJobId: propTypes.func,
  setJobName: propTypes.func,
  taskSlug: propTypes.string,
};

export default JobResultsDetails;
