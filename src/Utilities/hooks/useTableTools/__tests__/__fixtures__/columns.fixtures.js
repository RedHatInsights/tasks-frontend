export const taskColumnsFixtures = [
  {
    title: 'Task',
    props: {
      width: 35,
    },
    sortByProp: 'task_title',
    renderExport: (item) => item.task_title,
  },
  {
    title: 'Systems',
    props: {
      width: 20,
    },
    sortByProp: 'systems_count',
    renderExport: (item) => item.systems_count,
  },
  {
    title: 'Run date/time',
    props: {
      width: 20,
    },
    sortByProp: 'start_time',
    renderExport: (item) => item.start_time,
  },
];

export const jobCompleteColumnsFixtures = [
  {
    title: 'System name',
    props: {
      width: 30,
    },
    sortByProp: 'display_name',
    renderExport: (job) => job.display_name || 'System deleted',
  },
  {
    title: 'Status',
    props: {
      width: 10,
    },
    sortByProp: 'status',
    renderExport: (job) => job.status,
  },
  {
    title: 'Message',
    props: {
      width: 35,
    },
    renderExport: (job) =>
      job.status === 'Success' ? 'Completed' : job.status,
  },
];
