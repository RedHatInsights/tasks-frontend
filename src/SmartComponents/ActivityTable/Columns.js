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
  Content,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
} from '@patternfly/react-icons';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';
import { Skeleton } from '@redhat-cloud-services/frontend-components/Skeleton';

const TaskNameCell = ({ id, name }, index) => {
  return id ? (
    <InsightsLink key={`task-name-${index}`} to={`/executed/${id}`}>
      {name}
    </InsightsLink>
  ) : (
    <Skeleton width="100%" />
  );
};

TaskNameCell.propTypes = {
  id: propTypes.number,
  name: propTypes.any,
  index: propTypes.number,
};

const getStatusProps = (task) => {
  switch (task.status) {
    case TASK_STATUS.RUNNING:
      return {
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
        iconStatus: 'success',
        IconType: CheckCircleIcon,
      };
    case TASK_STATUS.COMPLETED_WITH_ERRORS:
      return {
        alertSeverity: 'danger',
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
        iconStatus: 'danger',
        IconType: ExclamationCircleIcon,
        popoverBodyText:
          'All jobs in this task failed to run on their target systems.',
      };
    case TASK_STATUS.CANCELLED:
      return {
        alertSeverity: 'danger',
        iconStatus: 'danger',
        IconType: ExclamationCircleIcon,
        popoverBodyText: 'All jobs in this task have been cancelled',
      };
  }
};

const formatPopoverBodyContent = (popoverBodyText) => {
  if (typeof popoverBodyText === 'string') {
    return (
      <Content component="p" style={{ paddingLeft: '1rem' }}>
        {popoverBodyText}
      </Content>
    );
  }

  let gridItems = [];
  popoverBodyText?.forEach((item) => {
    const [count, status] = item.split(' ');
    if (+count === 0) return; // don't display item when its count === 0
    const gridItem = (
      <React.Fragment>
        <GridItem span={2}>
          <Content component="p" style={{ textAlign: 'right' }}>
            {count}
          </Content>
        </GridItem>
        <GridItem span={10}>
          <Content component="p" style={{ textAlign: 'left' }}>
            {status}
          </Content>
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
    marginRight: '0.25rem',
  };

  const { alertSeverity, iconStatus, IconType, popoverBodyText } =
    getStatusProps(task);

  const icon = (
    <Icon status={iconStatus} style={{ marginRight: '0.25rem' }}>
      <IconType />
    </Icon>
  );

  const statusContent = (
    <span style={badgeStyle}>
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
