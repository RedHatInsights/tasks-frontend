import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  renderColumnComponent,
  renderRunDateTime,
} from '../../Utilities/helpers';

const TaskNameCell = ({ id, task_title }, index) => (
  <Link key={`task-title-${index}`} to={`/executed/${id}`}>
    {task_title}
  </Link>
);

TaskNameCell.propTypes = {
  id: propTypes.number,
  task_title: propTypes.string,
  index: propTypes.number,
};

export const TaskColumn = {
  title: 'Task',
  props: {
    width: 35,
  },
  sortByProp: 'task_title',
  renderExport: (task) => task.task_title,
  renderFunc: renderColumnComponent(TaskNameCell),
};

export const SystemsCountColumn = {
  title: 'Systems',
  props: {
    width: 20,
  },
  sortByProp: 'systems_count',
  renderExport: (task) => task.system_count,
};

export const RunDateTimeColumn = {
  title: 'Run date/time',
  props: {
    width: 20,
  },
  sortByProp: 'run_date_time',
  renderExport: (task) => renderRunDateTime(task.run_date_time),
};

export const exportableColumns = [
  TaskColumn,
  SystemsCountColumn,
  RunDateTimeColumn,
];

export default [TaskColumn, SystemsCountColumn, RunDateTimeColumn];
