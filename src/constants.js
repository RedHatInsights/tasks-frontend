import React from 'react';
import { Button } from '@patternfly/react-core';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { dispatchNotification } from './Utilities/Dispatcher';
import { getTimeDiff, renderRunDateTime } from './Utilities/helpers';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import TasksPopover from './PresentationalComponents/TasksPopover/TasksPopover';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import RunTaskButton from './PresentationalComponents/RunTaskButton/RunTaskButton';

/**
 * String constants
 */
const today = new Date();
export const TASKS_API_ROOT = '/api/tasks/v1';
export const AVAILABLE_TASKS_ROOT = '/tasks';
export const EXECUTED_TASKS_ROOT = '/executed_tasks';
export const SYSTEMS_ROOT = '/system';
const ACCESS_REDHAT_DOT_COM =
  'https://access.redhat.com/documentation/en-us/red_hat_insights/';
const YEAR = `${today.getFullYear()}/html/`;

export const TASKS_PAGE_TABS = ['Available tasks', 'Completed tasks'];

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

export const COMPLETED_INFO_PANEL = [
  { contents: <b>Systems</b>, match: ['system_count'] },
  {
    contents: <b>Run start</b>,
    match: ['start'],
    renderFunc: (start) => renderRunDateTime(...start),
  },
  {
    contents: <b>Run end</b>,
    match: ['start', 'end'],
    renderFunc: (start, end) => getTimeDiff(start, end),
  },
  { contents: <b>Initiated by</b>, match: ['initiated_by'] },
  { contents: <b>Systems with messages</b>, match: ['messages_count'] },
];

export const COMPLETED_INFO_BUTTONS_FLEX_PROPS = {
  align: { default: 'alignRigt' },
};

export const COMPLETED_INFO_BUTTONS = [
  {
    contents: (
      <Button variant="secondary" ouiaId="run-this-task-again-button">
        Run this task again
      </Button>
    ),
  },
  {
    contents: (
      <Button variant="primary" ouiaId="download-report-button">
        Download report
      </Button>
    ),
  },
];

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
};

const TASKS_PAGE_HEADER_POPOVER = (
  <TasksPopover
    label="tasks-header-popover"
    header={TASKS_PAGE_POPOVER_HEADER}
    body={TASKS_PAGE_POPOVER_BODY}
    footer={TASKS_PAGE_POPOVER_FOOTER}
    content={<OutlinedQuestionCircleIcon />}
  />
);

export const TASKS_PAGE_HEADER = [
  {
    contents: [TASKS_PAGE_HEADER_TITLE, TASKS_PAGE_HEADER_POPOVER],
  },
];

/**
 * Table constants
 */

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
 * Card Builder constants
 */

export const AVAILABLE_TASK_CARD_HEADER = {
  contents: [
    {
      content: (title) => title,
      match: 'title',
    },
  ],
};

export const AVAILABLE_TASK_CARD_BODY = {
  contents: [
    {
      content: (description) => description,
      match: 'description',
    },
  ],
  classname: 'card-task-description',
};

const DOWNLOAD_PLAYBOOK = {
  content: () => <a href="#">Download preview of playbook</a>,
  classname: 'preview-playbook-link',
  match: 'slug',
};

export const AVAILABLE_TASK_CARD_FOOTER = {
  contents: [
    DOWNLOAD_PLAYBOOK,
    {
      content: (task, openTaskModal) => (
        <RunTaskButton
          task={task}
          isFirst
          variant="primary"
          openTaskModal={openTaskModal}
        />
      ),
      match: 'all',
      actionFunc: 'openTaskModal',
    },
  ],
};
