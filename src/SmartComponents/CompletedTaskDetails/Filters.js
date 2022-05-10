import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const systemFilter = {
  type: conditionalFilterType.text,
  label: 'System',
  filter: (jobs, value) =>
    jobs.filter((job) =>
      job.display_name.toLowerCase().includes(value.toLowerCase())
    ),
};
