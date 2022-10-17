export default [
  {
    title: 'Task',
    props: {
      width: 35,
    },
    sortByProp: 'task_title',
  },
  {
    title: 'Systems',
    props: {
      width: 20,
    },
    sortByProp: 'systems_count',
    renderExport: (item) => item.system_count,
  },
  {
    title: 'Run date/time',
    props: {
      width: 20,
    },
    sortByProp: 'end_time',
  },
];
