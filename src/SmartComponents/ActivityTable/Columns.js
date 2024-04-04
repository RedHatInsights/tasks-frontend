import React from 'react';
import propTypes from 'prop-types';
import { renderColumnComponent } from '../../Utilities/helpers';
import { TASK_STATUS } from '../../constants';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Grid,
  GridItem,
  Icon,
  Popover,
  Text,
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
  switch (task.status) {
    case TASK_STATUS.RUNNING:
      return {
        badgeColor: '#2B9AF3',
        iconStatus: 'info',
        IconType: InProgressIcon,
        popoverBodyText: [
          `${task.running_jobs_count || 0} Running`,
          `${task.completed_jobs_count || 0} Completed`,
          `${task.failure_jobs_count || 0} Failed`,
          `${task.timeout_jobs_count || 0} Timeout`,
        ],
      };
    case TASK_STATUS.COMPLETED:
      return {
        alertSeverity: 'success',
        badgeColor: '#3E8635',
        iconStatus: 'success',
        IconType: CheckCircleIcon,
      };
    case TASK_STATUS.COMPLETED_WITH_ERRORS:
      return {
        alertSeverity: 'danger',
        badgeColor: '#a30000',
        iconStatus: 'danger',
        IconType: ExclamationCircleIcon,
        popoverBodyText: [
          `${task.running_jobs_count || 0} Running`,
          `${task.completed_jobs_count || 0} Completed`,
          `${task.failure_jobs_count || 0} Failed`,
          `${task.timeout_jobs_count || 0} Timeout`,
        ],
      };
    case TASK_STATUS.FAILURE:
      return {
        alertSeverity: 'danger',
        badgeColor: '#a30000',
        iconStatus: 'danger',
        IconType: ExclamationCircleIcon,
        popoverBodyText:
          'All jobs in this task failed to run on their target systems.',
      };
    case TASK_STATUS.CANCELLED:
      return {
        alertSeverity: 'danger',
        badgeColor: '#a30000',
        iconStatus: 'danger',
        IconType: ExclamationCircleIcon,
        popoverBodyText: 'All jobs in this task have been cancelled',
      };
  }
};

const formatPopoverBodyContent = (popoverBodyText) => {
  if (typeof popoverBodyText === 'string') {
    return <Text style={{ paddingLeft: '1rem' }}>{popoverBodyText}</Text>;
  }

  let gridItems = [];
  popoverBodyText?.forEach((item) => {
    const [count, status] = item.split(' ');
    if (+count === 0) return; // don't display item when its count === 0
    const gridItem = (
      <React.Fragment>
        <GridItem span={2}>
          <Text style={{ textAlign: 'right' }}>{count}</Text>
        </GridItem>
        <GridItem span={10}>
          <Text style={{ textAlign: 'left' }}>{status}</Text>
        </GridItem>
      </React.Fragment>
    );
    gridItems.push(gridItem);
  });

  return (
    <Grid hasGutter style={{ columnGap: '1rem', rowGap: '0' }}>
      {gridItems}
    </Grid>
  );
};

const StatusPopover = ({ task }) => {
  if (typeof task.status !== 'string') {
    return;
  }

  const badgeStyle = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '4px',
  };

  const { alertSeverity, badgeColor, iconStatus, IconType, popoverBodyText } =
    getStatusProps(task);

  const icon = (
    <Icon status={iconStatus} style={{ marginRight: '4px' }}>
      <IconType />
    </Icon>
  );

  const coloredBadgeStyle = { ...badgeStyle, color: badgeColor };
  const statusContent = (
    <span style={coloredBadgeStyle}>
      {icon}
      {task.status}
    </span>
  );

  const popoverBodyContent = (
    <div style={{ fontSize: 'medium', color: 'black' }}>
      {formatPopoverBodyContent(popoverBodyText)}
    </div>
  );

  return (
    <DescriptionList>
      <DescriptionListGroup>
        {popoverBodyText ? (
          <DescriptionListTermHelpText>
            <Popover
              alertSeverityVariant={alertSeverity}
              headerContent={
                task.status === 'Running' ? 'Task running' : task.status
              }
              bodyContent={popoverBodyContent}
              headerIcon={task.status === 'Running' ? null : <IconType />}
            >
              <DescriptionListTermHelpTextButton>
                {statusContent}
              </DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
        ) : (
          <DescriptionListTerm>{statusContent}</DescriptionListTerm>
        )}
      </DescriptionListGroup>
    </DescriptionList>
  );
};

StatusPopover.propTypes = {
  task: propTypes.object,
};

const StatusCell = (task) => {
  return typeof task?.status === 'string' ? (
    <StatusPopover task={task} />
  ) : (
    <div>{task.status}</div>
  );
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
