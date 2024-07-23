import React from 'react';
import propTypes from 'prop-types';
import { renderColumnComponent } from '../../Utilities/helpers';
import SplitMessages from '../../PresentationalComponents/SplitMessages/SplitMessages';
import get from 'lodash/get';

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
  renderExport: (job) => job.status,
};

export const ConversionStatusColumn = {
  ...StatusColumn,
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
  renderFunc: (_, _empty, job) => (
    <SplitMessages
      content={job.results.message}
      alert={
        job.results.alert === 'true' ||
        job.status === 'Failure' ||
        job.status === 'Timeout'
      }
    />
  ),
};

export const ReportColumn = {
  title: 'Report',
  renderExport: (job) => get(job, 'results.report', ''),
};

export const IssueTitleColumn = {
  title: 'Issue title',
  renderExport: (job) => get(job, 'issue_parsed[0]', ''),
};

export const IssueSeverityColumn = {
  title: 'Issue severity',
  renderExport: (job) => get(job, 'issue_parsed[1]', ''),
};

export const IssueKeyColumn = {
  title: 'Issue key',
  renderExport: (job) => get(job, 'issue_parsed[2]', ''),
};

export const IssueSummaryColumn = {
  title: 'Issue summary',
  renderExport: (job) => get(job, 'issue_parsed[3]', ''),
};

export const IssueDiagnosisColumn = {
  title: 'Issue diagnosis',
  renderExport: (job) => get(job, 'issue_parsed[4]', ''),
};

export const IssueRemediationTypeColumn = {
  title: 'Issue remediation type',
  renderExport: (job) => get(job, 'issue_parsed[5]', ''),
};

export const IssueRemediationColumn = {
  title: 'Issue remediation',
  renderExport: (job) => get(job, 'issue_parsed[6]', ''),
};

export const exportableColumns = [SystemColumn, StatusColumn, MessageColumn];
export const conversionColumns = [
  SystemColumn,
  ConversionStatusColumn,
  MessageColumn,
];
export const reportColumns = [
  ReportColumn,
  IssueTitleColumn,
  IssueSeverityColumn,
  IssueKeyColumn,
  IssueSummaryColumn,
  IssueDiagnosisColumn,
  IssueRemediationTypeColumn,
  IssueRemediationColumn,
];

export default [SystemColumn, StatusColumn, MessageColumn];
