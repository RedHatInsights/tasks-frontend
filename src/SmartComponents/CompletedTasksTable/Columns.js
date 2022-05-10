import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  renderColumnComponent,
  renderRunDateTime,
} from '../../Utilities/helpers';

const TaskNameCell = ({ id, title }, index) => (
  <Link key={`task-title-${index}`} to={`/executed/${id}`}>
    {title}
  </Link>
);

TaskNameCell.propTypes = {
  id: propTypes.string,
  title: propTypes.string,
  index: propTypes.number,
};

export const TaskColumn = {
  title: 'Task',
  props: {
    width: 35,
  },
  sortByProp: 'title',
  renderExport: (task) => task.title,
  renderFunc: renderColumnComponent(TaskNameCell),
};

export const SystemsCountColumn = {
  title: 'Systems',
  props: {
    width: 20,
  },
  sortByProp: 'system_count',
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
