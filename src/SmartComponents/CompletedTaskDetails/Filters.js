import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const systemFilter = [
  {
    type: conditionalFilterType.text,
    label: 'Name',
    filter: (jobs, value) =>
      jobs.filter((job) =>
        typeof job.display_name === 'string'
          ? job.display_name.toLowerCase().includes(value.toLowerCase())
          : null
      ),
  },
];

export const buildStatusFilter = (isConversionTask) => {
  return [
    {
      type: conditionalFilterType.checkbox,
      label: 'Status',
      filter: (jobs, value) =>
        jobs.filter((job) => value.includes(job.status.toLowerCase())),
      items: [
        { label: 'Running', value: 'running' },
        { label: isConversionTask ? 'Completed' : 'Success', value: 'success' },
        { label: 'Failure', value: 'failure' },
        { label: 'Timeout', value: 'timeout' },
      ],
    },
  ];
};
