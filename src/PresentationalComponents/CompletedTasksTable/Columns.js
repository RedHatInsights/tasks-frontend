export const Task = {
  title: 'Task',
  props: {
    width: 35,
  },
  sortByProp: 'title',
  //renderExport: (task) => task.title,
};

export const Systems = {
  title: 'Systems',
  props: {
    width: 20,
  },
  sortByProp: 'system_count',
  //renderExport: (task) => task.totalSystemCount,
};

export const RunDateTime = {
  title: 'Run date/time',
  props: {
    width: 20,
  },
  sortByProp: 'runDateTime',
  //renderExport: (task) => task.runDateTime,
};

//export const exportableColumns = [Task, Systems, RunDateTime];

export default [Task, Systems, RunDateTime];
