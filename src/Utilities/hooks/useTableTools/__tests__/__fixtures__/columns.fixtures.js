export default [
  {
    title: 'Task',
    props: {
      width: 35,
    },
    sortByProp: 'title',
  },
  {
    title: 'Systems',
    props: {
      width: 20,
    },
    sortByProp: 'system_count',
    renderExport: (item) => item.system_count,
  },
  {
    title: 'Run date/time',
    props: {
      width: 20,
    },
    sortByProp: 'run_date_time',
  },
];
