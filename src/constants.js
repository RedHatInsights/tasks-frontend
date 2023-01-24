import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { dispatchNotification } from './Utilities/Dispatcher';
import { getTimeDiff, renderRunDateTime } from './Utilities/helpers';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import TasksPopover from './PresentationalComponents/TasksPopover/TasksPopover';
import CompletedTaskDetailsKebab from './SmartComponents/CompletedTaskDetailsKebab/CompletedTaskDetailsKebab';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import RunTaskButton from './PresentationalComponents/RunTaskButton/RunTaskButton';

/**
 * String constants
 */
const today = new Date();
export const TASKS_API_ROOT = '/api/tasks/v1';
export const AVAILABLE_TASKS_ROOT = '/task';
export const EXECUTED_TASK_ROOT = '/executed_task';
export const SYSTEMS_ROOT = '/system';
const ACCESS_REDHAT_DOT_COM =
  'https://access.redhat.com/documentation/en-us/red_hat_insights/';
const YEAR = `${today.getFullYear()}/html/`;

export const TASKS_PAGE_TABS = ['Available', 'Activity'];
export const TASKS_ERROR = [
  'Available tasks cannot be displayed at this time. Please retry and if the problem persists contact your system administrator.',
  '',
];
export const COMPLETED_TASKS_ERROR = [
  'Activities connot be displayed at this time. Please return and if the problem persists contact your system administrator.',
  '',
];
export const TASK_ERROR = [
  'This task cannot be displayed at this time. Please retry and if the problem persists contact your system administrator.',
  '',
];
export const EMPTY_TASKS_TITLE = 'No available tasks';
export const EMPTY_TASKS_MESSAGE = [
  'Tasks are created and released by Red Hat. At this moment, there are no tasks available to run.',
];
export const EMPTY_COMPLETED_TASKS_TITLE = 'No completed tasks';
export const EMPTY_COMPLETED_TASKS_MESSAGE = [
  'Tasks allows you to run resource -intesive additional troubleshooting on your connected systems. Ansible Playbooks are written by Red Hat to do the selected tasks.',
  '',
  'To use a task, navigate to the "Available tasks" tab and choose a task to run.',
];
export const INFO_ALERT_SYSTEMS =
  'Eligible systems include systems connected to console.redhat.com with rhc, or Satellite with Cloud Connector.';

export const JOB_FAILED_MESSAGE =
  'Task failed to complete for an unknown reason. Retry this task at a later time.';

export const JOB_TIMED_OUT_MESSAGE =
  'Task failed to complete due to timing out. Retry this task at a later time.';

export const JOB_RUNNING_MESSAGE = 'No result yet';

/**
 * Flex constants
 */

export const COMPLETED_INFO_PANEL_FLEX_PROPS = {
  direction: { default: 'column' },
};
export const TASKS_PAGE_HEADER_FLEX_PROPS = {
  flex: { default: 'flex_1' },
  alignItems: { default: 'alignItemsCenter' },
  flexWrap: { default: 'nowrap' },
};
export const COMPLETED_INFO_BUTTONS_FLEX_PROPS = {
  align: { default: 'alignRigt' },
};

export const COMPLETED_INFO_PANEL = [
  { children: <b>Systems</b>, match: ['system_count'], key: 'systems' },
  {
    children: <b>Run start</b>,
    match: ['start_time'],
    key: 'run-start',
    renderFunc: (start) => renderRunDateTime(...start),
  },
  {
    children: <b>Run end</b>,
    match: ['start_time', 'end_time', 'status'],
    key: 'run-end',
    renderFunc: (start, end, status) => getTimeDiff(start, end, status),
  },
  {
    children: <b>Initiated by</b>,
    match: ['initiated_by'],
    key: 'initiated-by',
  },
  {
    children: <b>Systems with alerts</b>,
    match: ['alerts_count'],
    key: 'systems-with-alerts',
  },
];

export const COMPLETED_INFO_BUTTONS = (
  slug,
  openTaskModal,
  status,
  setModalOpened
) => {
  return [
    {
      children: (
        <RunTaskButton
          openTaskModal={openTaskModal}
          slug={slug}
          variant="secondary"
        />
      ),
      key: 'run-task-again-details-button',
    },
    {
      children: (
        <CompletedTaskDetailsKebab
          status={status}
          setModalOpened={setModalOpened}
        />
      ),
      key: 'completed-task-details-kebab',
    },
  ];
};

const TASKS_PAGE_POPOVER_HEADER = <div>About tasks</div>;

const TASKS_PAGE_POPOVER_BODY = (
  <div>
    Tasks allows you to run resource-intensive additional troubleshooting on
    your connected systems. Ansible Playbooks are written by Red Hat to do the
    selected tasks.
    <br /> <br />
    Eligible systems include systems connected to console.redhat.com with rhc,
    or Satellite with Cloud Connector.
  </div>
);

const TASKS_PAGE_POPOVER_FOOTER = (
  <div>
    <a
      href={`${ACCESS_REDHAT_DOT_COM}${YEAR}red_hat_connector_configuration_guide/index`}
    >
      <span>
        Using rhc with systems <ExternalLinkAltIcon />
      </span>
    </a>
    <br />
    <a
      href={`${ACCESS_REDHAT_DOT_COM}${YEAR}using_cloud_connector_to_remediate_issues_across_your_red_hat_satellite_infrastructure/index`}
    >
      <span>
        Configure Cloud Connector and Satellite <ExternalLinkAltIcon />
      </span>
    </a>
  </div>
);

const TASKS_PAGE_HEADER_TITLE = {
  children: <PageHeaderTitle title="Tasks" />,
  classname: 'page-header-title',
  key: 'tasks-page-header-title',
};

const TASKS_PAGE_HEADER_POPOVER = {
  children: (
    <TasksPopover
      label="tasks-header-popover"
      header={TASKS_PAGE_POPOVER_HEADER}
      body={TASKS_PAGE_POPOVER_BODY}
      footer={TASKS_PAGE_POPOVER_FOOTER}
      content={<OutlinedQuestionCircleIcon />}
    />
  ),
  key: 'tasks-page-header-popover',
};

export const TASKS_PAGE_HEADER = [
  {
    children: [TASKS_PAGE_HEADER_TITLE, TASKS_PAGE_HEADER_POPOVER],
    key: 'tasks-page-header',
  },
];

/**
 * Table constants
 */

export const COMPLETED_TASKS_TABLE_DEFAULTS = {
  sortBy: {
    index: 2,
    direction: 'desc',
  },
};

export const TASKS_TABLE_DEFAULTS = {
  exportable: {
    onStart: () => {
      dispatchNotification({
        variant: 'info',
        title: 'Preparing export',
        description: 'Once complete, your download will start automatically.',
      });
    },
    onComplete: () => {
      dispatchNotification({
        variant: 'success',
        title: 'Downloading export',
      });
    },
  },
};

/**
 * Loading constants
 */

export const LOADING_CONTENT = [
  { title: <Skeleton size={SkeletonSize.md} /> },
  { description: <Skeleton size={SkeletonSize.md} /> },
];

export const TASK_LOADING_CONTENT = {
  task_title: <Skeleton size={SkeletonSize.sm} />,
  task_description: <Skeleton size={SkeletonSize.md} />,
};

export const LOADING_INFO_PANEL = {
  system_count: <Skeleton size={SkeletonSize.md} />,
  start_time: 'loading',
  initiated_by: <Skeleton size={SkeletonSize.md} />,
  alerts_count: <Skeleton size={SkeletonSize.md} />,
};

export const LOADING_JOBS_TABLE = [
  {
    display_name: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    results: { message: <Skeleton size={SkeletonSize.md} /> },
  },
  {
    display_name: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    results: { message: <Skeleton size={SkeletonSize.md} /> },
  },
  {
    display_name: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    results: { message: <Skeleton size={SkeletonSize.md} /> },
  },
  {
    display_name: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    results: { message: <Skeleton size={SkeletonSize.md} /> },
  },
  {
    display_name: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    results: { message: <Skeleton size={SkeletonSize.md} /> },
  },
];

export const LOADING_ACTIVITIES_TABLE = [
  {
    task_title: <Skeleton size={SkeletonSize.md} />,
    systems_count: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    run_date_time: <Skeleton size={SkeletonSize.md} />,
  },
  {
    task_title: <Skeleton size={SkeletonSize.md} />,
    systems_count: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    run_date_time: <Skeleton size={SkeletonSize.md} />,
  },
  {
    task_title: <Skeleton size={SkeletonSize.md} />,
    systems_count: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    run_date_time: <Skeleton size={SkeletonSize.md} />,
  },
  {
    task_title: <Skeleton size={SkeletonSize.md} />,
    systems_count: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    run_date_time: <Skeleton size={SkeletonSize.md} />,
  },
  {
    task_title: <Skeleton size={SkeletonSize.md} />,
    systems_count: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    run_date_time: <Skeleton size={SkeletonSize.md} />,
  },
];

/*eslint-disable react/no-unescaped-entities*/
export const EXECUTE_TASK_NOTIFICATION = (title, ids, task_id) => {
  dispatchNotification({
    variant: 'info',
    title: 'Task running',
    description: (
      <span>
        Your task "{title}" is running on {ids.length} system
        {ids.length > 1 ? 's' : ''}.
        <br />
        <br />
        <Link to={`/executed/${task_id}`}>View progress</Link>
      </span>
    ),
    dismissable: true,
  });
};
/*eslint-enable react/no-unescaped-entities*/

export const DELETE_TASK_BODY = (startTime, title) => {
  return `Deleting the ${moment
    .utc(startTime)
    .format(
      'MMM DD YYYY'
    )} run of "${title}" will remove all data about this task. The report will no longer be accessible.`;
};

export const DELETE_TASK_ERROR = (title) => {
  return `Error: Task "${title}" could not be deleted`;
};

export const CANCEL_TASK_BODY = (startTime, title) => {
  return `Cancelling the ${startTime} run of "${title}" will stop any analysis in progress. Any existing results will be available.`;
};

export const CANCEL_TASK_ERROR = (title) => {
  return `Error: Task "${title}" could not be cancelled`;
};
