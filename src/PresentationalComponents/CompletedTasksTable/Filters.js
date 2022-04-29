import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const nameFilter = {
  type: conditionalFilterType.text,
  label: 'Task',
  filter: (tasks, value) =>
    tasks.filter((task) =>
      task.title.toLowerCase().includes(value.toLowerCase())
    ),
};
