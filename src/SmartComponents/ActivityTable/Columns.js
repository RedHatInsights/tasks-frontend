import React from 'react';
import propTypes from 'prop-types';
import { renderColumnComponent } from '../../Utilities/helpers';
import { CheckCircleIcon, InProgressIcon } from '@patternfly/react-icons';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';

const TaskNameCell = ({ id, task_title }, index) => (
  <InsightsLink key={`task-title-${index}`} to={`/executed/${id}`}>
    {task_title}
  </InsightsLink>
);

TaskNameCell.propTypes = {
  id: propTypes.number,
  task_title: propTypes.any,
  index: propTypes.number,
};

const StatusCell = ({ status }) =>
  ({
    Completed: (
      <span style={{ color: '#3E8635', display: 'flex', alignItems: 'center' }}>
        <CheckCircleIcon color="#3E8635" style={{ marginRight: '4px' }} />
        {status}
      </span>
    ),
    Running: (
      <span style={{ color: '#2B9AF3', display: 'flex', alignItems: 'center' }}>
        <InProgressIcon color="#2B9AF3" style={{ marginRight: '4px' }} />
        {status}
      </span>
    ),
  }[status] || status);

StatusCell.propTypes = {
  status: propTypes.oneOfType([propTypes.string, propTypes.object]),
};

export const TaskColumn = {
  title: 'Task',
  props: {
    width: 25,
  },
  sortByProp: 'task_title',
  renderExport: (task) => task.task_title,
  renderFunc: renderColumnComponent(TaskNameCell),
};

export const SystemsCountColumn = {
  title: 'Systems',
  props: {
    width: 10,
  },
  sortByProp: 'systems_count',
  renderExport: (task) => task.systems_count,
};

export const StatusColumn = {
  title: 'Status',
  props: {
    width: 10,
  },
  sortByProp: 'status',
  renderExport: (task) => task.status,
  renderFunc: renderColumnComponent(StatusCell),
};

export const RunDateTimeColumn = {
  title: 'Run date/time',
  props: {
    width: 20,
  },
  sortByProp: 'end_time',
  renderExport: (task) => task.run_date_time,
  renderFunc: (_, _empty, result) => result.run_date_time,
};

export const exportableColumns = [
  TaskColumn,
  SystemsCountColumn,
  StatusColumn,
  RunDateTimeColumn,
];

export default [
  TaskColumn,
  SystemsCountColumn,
  StatusColumn,
  RunDateTimeColumn,
];
