import React from 'react';
import propTypes from 'prop-types';
import { renderColumnComponent } from '../../Utilities/helpers';
import SplitMessages from '../../PresentationalComponents/SplitMessages/SplitMessages';
import { Skeleton } from '@patternfly/react-core';

const SystemNameCell = ({ display_name }) => {
  if (display_name) {
    return display_name;
  } else {
    return <span style={{ color: '#72767B' }}>System deleted</span>;
  }
};

SystemNameCell.propTypes = {
  system: propTypes.string,
  display_name: propTypes.node,
};

export const SystemColumn = {
  title: 'System name',
  props: {
    width: 30,
  },
  sortByProp: 'display_name',
  renderExport: (job) => job.display_name || 'System deleted',
  renderFunc: renderColumnComponent(SystemNameCell),
};

export const StatusColumn = {
  title: 'Status',
  props: {
    width: 10,
  },
  sortByProp: 'status',
  renderExport: (job) => (job.status === 'Success' ? 'Completed' : job.status),
  renderFunc: (_, _empty, job) =>
    job.status === 'Success' ? 'Completed' : job.status,
};

export const MessageColumn = {
  title: 'Message',
  props: {
    width: 35,
  },
  sortByFunction: (job) => job.results.message,
  renderExport: (job) => job.results.message,
  renderFunc: (_, _empty, job) =>
    job.results.message?.length ? (
      <SplitMessages
        content={job.results.message}
        alert={
          job.results.alert === 'true' ||
          job.status === 'Failure' ||
          job.status === 'Timeout'
        }
      />
    ) : (
      <Skeleton width="100%" />
    ),
};

export const ReportColumn = {
  title: 'Report',
  renderExport: (job) => job.results?.report || '',
};

export const IssueTitleColumn = {
  title: 'Issue title',
  renderExport: (job) => job.issue_parsed.title,
};

export const IssueSeverityColumn = {
  title: 'Issue severity',
  renderExport: (job) => job.issue_parsed.severity,
};

export const IssueKeyColumn = {
  title: 'Issue key',
  renderExport: (job) => job.issue_parsed.key,
};

export const IssueSummaryColumn = {
  title: 'Issue summary',
  renderExport: (job) => job.issue_parsed.summary,
};

export const IssueDiagnosisColumn = {
  title: 'Issue diagnosis',
  renderExport: (job) => job.issue_parsed.diagnosis,
};

export const IssueRemediationTypeColumn = {
  title: 'Issue remediation type',
  renderExport: (job) => job.issue_parsed.remediationType,
};

export const IssueRemediationColumn = {
  title: 'Issue remediation',
  renderExport: (job) => job.issue_parsed.remediationContext,
};

export const exportableColumns = [SystemColumn, StatusColumn, MessageColumn];
export const extendedReportColumns = [
  IssueTitleColumn,
  IssueSeverityColumn,
  IssueKeyColumn,
  IssueSummaryColumn,
  IssueDiagnosisColumn,
  IssueRemediationTypeColumn,
  IssueRemediationColumn,
];

export default [SystemColumn, StatusColumn, MessageColumn];
