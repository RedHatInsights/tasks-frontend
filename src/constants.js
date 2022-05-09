import React from 'react';
import { Button } from '@patternfly/react-core';
import { dispatchNotification } from './Utilities/Dispatcher';
import { getTimeDiff, renderRunDateTime } from './Utilities/helpers';

export const TASKS_API_ROOT = '/api/tasks/v1';
export const EXECUTED_TASKS_ROOT = '/executed_tasks';
export const TASKS_PAGE_TABS = ['Available tasks', 'Completed tasks'];
export const COMPLETED_INFO_PANEL_FLEX_PROPS = {
  direction: { default: 'column' },
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
