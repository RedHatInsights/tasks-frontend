import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const systemFilter = [
  {
    type: conditionalFilterType.text,
    label: 'System',
    filter: (jobs, value) =>
      jobs.filter((job) =>
        job.display_name
          ? job.display_name.toLowerCase().includes(value.toLowerCase())
          : null
      ),
  },
];

export const statusFilters = [
  {
    type: conditionalFilterType.checkbox,
    label: 'Status',
    filter: (jobs, value) =>
      jobs.filter((job) => value.includes(job.status.toLowerCase())),
    items: [
      { label: 'Running', value: 'running' },
      { label: 'Success', value: 'success' },
      { label: 'Failure', value: 'failure' },
      { label: 'Timeout', value: 'timeout' },
    ],
  },
];
