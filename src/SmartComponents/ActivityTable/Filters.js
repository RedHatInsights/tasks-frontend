import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const nameFilter = [
  {
    type: conditionalFilterType.text,
    label: 'Task',
    filter: (tasks) => tasks,
  },
];

export const statusFilter = [
  {
    type: conditionalFilterType.checkbox,
    label: 'Status',
    filter: (tasks) => tasks,
    items: [
      { label: 'Running', value: 'Running' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Completed With Errors', value: 'Completed With Errors' },
      { label: 'Failure', value: 'Failure' },
    ],
  },
];
