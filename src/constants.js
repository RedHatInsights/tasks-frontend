import { dispatchNotification } from './Utilities/Dispatcher';

export const TASKS_API_ROOT = '/api/tasks/v1';
export const EXECUTED_TASKS_ROOT = '/executed_tasks';
export const TASKS_PAGE_TABS = ['Available tasks', 'Completed tasks'];

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
