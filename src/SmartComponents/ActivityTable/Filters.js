import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const nameFilter = [
  {
    type: conditionalFilterType.text,
    label: 'Task',
    filter: (tasks, value) =>
      tasks.filter((task) =>
        typeof task.name === 'string'
          ? task.name.toLowerCase().includes(value.toLowerCase())
          : null
      ),
  },
];

export const statusFilter = [
  {
    type: conditionalFilterType.singleSelect,
    label: 'Status',
    filter: (tasks, value) =>
      tasks.filter((task) => value.includes(task.status.toLowerCase())),
    items: [
      { label: 'Running', value: 'running' },
      { label: 'Completed', value: 'completed' },
      { label: 'Completed with errors', value: 'completed with errors' },
      { label: 'Failure', value: 'failure' },
    ],
  },
];
