import './Column.scss';
import React from 'react';
import propTypes from 'prop-types';
import { renderColumnComponent } from '../../Utilities/helpers';
import { TASK_STATUS } from '../../constants';
import {
  Icon,
  Popover,
  TextContent,
  TextList,
  TextListItem,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
} from '@patternfly/react-icons';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';

const TaskNameCell = ({ id, name }, index) => (
  <InsightsLink key={`task-name-${index}`} to={`/executed/${id}`}>
    {name}
  </InsightsLink>
);

TaskNameCell.propTypes = {
  id: propTypes.number,
  name: propTypes.any,
  index: propTypes.number,
};

const getStatusProps = (task) => {
  let badgeColor, iconStatus, IconType, message, hasPopover;

  message = '';
  hasPopover = true;
  switch (task.status) {
    case TASK_STATUS.RUNNING:
      badgeColor = '#2B9AF3';
      iconStatus = 'info';
      IconType = InProgressIcon;
      message = [
        `${task.running_job_count || 0} Running`,
        `${task.completed_job_count || 0} Completed`,
      ];
      break;
    case TASK_STATUS.COMPLETED:
      badgeColor = '#3E8635';
      iconStatus = 'success';
      IconType = CheckCircleIcon;
      hasPopover = false;
      break;
    case TASK_STATUS.COMPLETED_WITH_ERRORS:
      badgeColor = '#FF0000';
      iconStatus = 'danger';
      IconType = ExclamationCircleIcon;
      message = [
        `${task.failure_job_count || 0} Failed`,
        `${task.timeout_job_count || 0} Timeout`,
        `${task.completed_job_count || 0} Completed`,
      ];
      break;
    case TASK_STATUS.FAILURE:
      badgeColor = '#FF0000';
      iconStatus = 'danger';
      IconType = ExclamationCircleIcon;
      message = 'All jobs in this task failed to run on their target systems.';
      break;
    case TASK_STATUS.CANCELLED:
      badgeColor = '#FF0000';
      iconStatus = 'danger';
      IconType = ExclamationCircleIcon;
      message = 'All jobs in this task have been cancelled';
      break;
  }

  return { badgeColor, iconStatus, IconType, message, hasPopover };
};

const StatusCell = (task) => {
  if (typeof task.status !== 'string') {
    return;
  }

  const badgeStyle = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '4px',
  };

  const { badgeColor, iconStatus, IconType, message, hasPopover } =
    getStatusProps(task);

  const coloredBadgeStyle = { ...badgeStyle, color: badgeColor };
  const statusContent = (
    <span>
      <Icon status={iconStatus} style={{ marginRight: '4px' }}>
        <IconType />
      </Icon>
      {!hasPopover ? (
        <span>{task.status}</span>
      ) : (
        <span className="popoverLink">{task.status}</span>
      )}
    </span>
  );

  if (!hasPopover) {
    return <span style={coloredBadgeStyle}>{statusContent}</span>;
  }
  let textItemMessage;
  if (typeof message === 'string') {
    textItemMessage = <TextListItem>{message}</TextListItem>;
  } else {
    textItemMessage = message.map((item, index) => (
      <TextListItem key={index}>{item}</TextListItem>
    ));
  }
  return (
    <span style={coloredBadgeStyle}>
      <Popover
        style={coloredBadgeStyle}
        position={'right'}
        headerIcon={
          <Icon status={iconStatus}>
            <IconType />
          </Icon>
        }
        headerContent={<div>{task.status}</div>}
        bodyContent={
          <div style={{ color: 'black' }}>
            <TextContent>
              <TextList isPlain={true}>{textItemMessage}</TextList>
            </TextContent>
          </div>
        }
      >
        {statusContent}
      </Popover>
    </span>
  );
};

StatusCell.propTypes = {
  status: propTypes.oneOfType([propTypes.string, propTypes.object]),
};

export const TaskColumn = {
  title: 'Task',
  props: {
    width: 25,
  },
  sortByProp: 'name',
  renderExport: (task) => task.name,
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
  sortByProp: 'start_time',
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
