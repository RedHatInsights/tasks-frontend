export const Task = {
  title: 'Task',
  props: {
    width: 35,
  },
  sortByProp: 'title',
  renderExport: (task) => task.title,
};

export const Systems = {
  title: 'Systems',
  props: {
    width: 20,
  },
  sortByProp: 'system_count',
  renderExport: (task) => task.system_count,
};

export const RunDateTime = {
  title: 'Run date/time',
  props: {
    width: 20,
  },
  sortByProp: 'end',
  renderExport: (task) => task.end,
};

export const exportableColumns = [Task, Systems, RunDateTime];

export default [Task, Systems, RunDateTime];
