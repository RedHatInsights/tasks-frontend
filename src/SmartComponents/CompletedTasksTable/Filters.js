import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const nameFilter = {
  type: conditionalFilterType.text,
  label: 'Task',
  filter: (tasks, value) =>
    tasks.filter((task) =>
      task.task_title.toLowerCase().includes(value.toLowerCase())
    ),
};
