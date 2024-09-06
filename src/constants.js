import React from 'react';
import moment from 'moment';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { dispatchNotification } from './Utilities/Dispatcher';
import { getTimeDiff, renderRunDateTime } from './Utilities/helpers';
import TasksPopover from './PresentationalComponents/TasksPopover/TasksPopover';
import CompletedTaskDetailsKebab from './SmartComponents/CompletedTaskDetailsKebab/CompletedTaskDetailsKebab';
import {
  TasksPagePopoverHeader,
  TasksPagePopoverBody,
  TasksPagePopoverIcon,
  TasksPagePopoverFooter,
} from './PresentationalComponents/TasksPopover/TasksPageHeaderPopover';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import RunTaskButton from './PresentationalComponents/RunTaskButton/RunTaskButton';
import { createLink } from './helpers';

/**
 * String constants
 */
export const TASKS_API_ROOT = '/api/tasks/v1';
export const AVAILABLE_TASKS_ROOT = '/task';
export const EXECUTED_TASK_ROOT = '/executed_task';
export const SYSTEMS_ROOT = '/system';
export const JOB_ROOT = '/job';
export const LOG_ROOT = '/stdout';
export const INSIGHTS_DOCUMENTATION =
  'https://access.redhat.com/documentation/en-us/red_hat_insights/';
export const DOC_VERSION = '1-latest/html/';
export const HOST_COMMUNICATION_DOC_PATH =
  'red_hat_insights_remediations_guide/host-communication-with-insights_red-hat-insights-remediation-guide';
export const RHC_DOC =
  '#enabling-rhc-client_red-hat-insights-remediation-guide';
export const SATELLITE_DOC =
  '#configuring-satellite-cloud-connector_red-hat-insights-remediation-guide';

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
export const EMPTY_EXECUTED_TASK_JOBS_TITLE =
  'No Jobs were created for this task';
export const EMPTY_EXECUTED_TASK_JOBS_MESSAGE = [
  'No jobs could run on the selected systems because they are no longer connected.',
  '',
  'Ensure the systems are connected and try the task again. If the problem persists, please contact Red Hat Support.',
];
export const INFO_ALERT_SYSTEMS =
  'Eligible systems include systems connected to console.redhat.com with rhc, or Satellite with Cloud Connector.';

export const JOB_FAILED_MESSAGE =
  'Task failed to complete for an unknown reason. Retry this task at a later time.';

export const JOB_TIMED_OUT_MESSAGE =
  'Task failed to complete due to timing out. Retry this task at a later time.';

export const JOB_RUNNING_MESSAGE = 'No result yet';
export const CONVERSION_SLUG = 'convert-to-rhel';

export const TASK_STATUS = {
  RUNNING: 'Running',
  COMPLETED: 'Completed',
  COMPLETED_WITH_ERRORS: 'Completed With Errors',
  FAILURE: 'Failure',
  CANCELLED: 'Cancelled',
};

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
  align: { default: 'alignRight' },
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

const TASKS_PAGE_HEADER_TITLE = {
  children: <PageHeaderTitle className="pf-u-display-inline" title="Tasks" />,
  classname: 'pf-u-mr-0',
  key: 'tasks-page-header-title',
};

const TASKS_PAGE_HEADER_POPOVER = {
  children: (
    <TasksPopover
      label="tasks-header-popover"
      header={<TasksPagePopoverHeader />}
      body={<TasksPagePopoverBody />}
      footer={<TasksPagePopoverFooter />}
      content={<TasksPagePopoverIcon />}
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
    index: 3,
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
export const TASK_LOADING_CONTENT = {
  name: '',
  task_description: <Skeleton size={SkeletonSize.md} />,
  task_title: <Skeleton size={SkeletonSize.md} />,
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
    name: <Skeleton size={SkeletonSize.md} />,
    systems_count: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    run_date_time: <Skeleton size={SkeletonSize.md} />,
  },
  {
    name: <Skeleton size={SkeletonSize.md} />,
    systems_count: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    run_date_time: <Skeleton size={SkeletonSize.md} />,
  },
  {
    name: <Skeleton size={SkeletonSize.md} />,
    systems_count: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    run_date_time: <Skeleton size={SkeletonSize.md} />,
  },
  {
    name: <Skeleton size={SkeletonSize.md} />,
    systems_count: <Skeleton size={SkeletonSize.md} />,
    status: <Skeleton size={SkeletonSize.md} />,
    run_date_time: <Skeleton size={SkeletonSize.md} />,
  },
  {
    name: <Skeleton size={SkeletonSize.md} />,
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
        <InsightsLink to={`/executed/${task_id}`}>View progress</InsightsLink>
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

/**
 * Conversion task parameter constants
 */
export const READ_MORE_ABOUT_ELS_LINK = createLink(
  'https://www.redhat.com/en/blog/announcing-4-years-extended-life-cycle-support-els-red-hat-enterprise-linux-7',
  'Read more about ELS for RHEL 7.'
);
export const CONVERT2RHEL_SUPPORT_LINK = createLink(
  'https://access.redhat.com/support/policy/convert2rhel-support',
  'Convert2RHEL Support Policy'
);
export const IN_PLACE_UPGRADE_SUPPORT_LINK = createLink(
  'https://access.redhat.com/support/policy/ipu-support',
  'In-place upgrade Support Policy'
);
export const PREVENT_KERNEL_MODULE_LOADING_LINK = createLink(
  'https://access.redhat.com/solutions/41278',
  'How do I prevent a kernel module from loading automatically?'
);
export const TAINTED_KERNEL_MODULES_LINK = createLink(
  'https://www.kernel.org/doc/html/v6.9/admin-guide/tainted-kernels.html',
  'Tainted kernel modules'
);
export const CONVERT2RHEL_ANALYSIS_TITLE =
  'Analyze conversion to RHEL 7 without Extended Lifecycle Support (ELS)';
export const CONVERT2RHEL_CONVERSION_TITLE =
  'Convert to RHEL 7 without Extended Lifecycle Support (ELS)';
export const CONVERT2RHEL_ANALYSIS_DESCRIPTION = (
  <React.Fragment>
    By default, the task analyzes a conversion of your CentOS Linux 7 to a
    supported RHEL 7 system with the latest security patches and updates via
    ELS. {READ_MORE_ABOUT_ELS_LINK}
  </React.Fragment>
);
export const CONVERT2RHEL_CONVERSION_DESCRIPTION = (
  <React.Fragment>
    By default, the task converts your CentOS Linux 7 to a supported RHEL 7
    system with the latest security patches and updates via ELS.{' '}
    {READ_MORE_ABOUT_ELS_LINK}
  </React.Fragment>
);
export const ELS_DISABLED_CUSTOM_DESCRIPTION = (
  <React.Fragment>
    If you plan to upgrade to RHEL 8 right after the conversion, you may opt not
    to use the ELS subscription. Note that the conversion and the subsequent
    upgrade without an ELS subscription come with a limited support scope per
    the {CONVERT2RHEL_SUPPORT_LINK} and the {IN_PLACE_UPGRADE_SUPPORT_LINK}.
  </React.Fragment>
);
export const ALLOW_UNAVAILABLE_KMODS_CUSTOM_DESCRIPTION = (
  <React.Fragment>
    We cannot guarantee that the loaded kernel modules reported by the
    pre-conversion analysis as not available in RHEL repositories will function
    properly with a RHEL kernel after the conversion. We recommend you to unload
    the modules by following {PREVENT_KERNEL_MODULE_LOADING_LINK}, perform the
    conversion without the modules loaded and verify they work upon loading them
    after the conversion. Using this option is equivalent to setting the
    CONVERT2RHEL_ALLOW_UNAVAILABLE_KMODS environment variable on the command
    line.
  </React.Fragment>
);
export const TAINTED_KERNEL_MODULE_CUSTOM_DESCRIPTION = (
  <React.Fragment>
    {TAINTED_KERNEL_MODULES_LINK} present a potential source of conversion
    issues. We recommend you to unload the modules by following{' '}
    {PREVENT_KERNEL_MODULE_LOADING_LINK} Use this option if you cannot do so.
    Using this option is equivalent to setting the
    CONVERT2RHEL_TAINTED_KERNEL_MODULE_CHECK_SKIP environment variable on the
    command line.
  </React.Fragment>
);
