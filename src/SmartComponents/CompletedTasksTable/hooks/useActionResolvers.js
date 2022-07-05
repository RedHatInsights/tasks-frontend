const useActionResolver = (handleTask) => {
  const onClick = (apiCall, task) => {
    apiCall(task);
  };

  return (/*row*/) => [
    /*{
      title: 'Download report',
      onClick: (_event, _index, task) =>
        onClick(`/executed_task/${task.id}/delete`, task),
    },
    {
      title: 'Run this task again',
      onClick: (_event, _index, task) =>
        onClick(`/executed_task/${task.id}/delete`, task),
    },*/
    {
      title: 'Delete',
      /*row.task.title.props.status === 'Completed' ||
        row.task.title.props.status === 'Cancelled'
          ? 'Delete'
          : 'Cancel',*/
      onClick: (_event, _index, task) => {
        onClick(handleTask, task.task.title.props);
      },
    },
  ];
};

export default useActionResolver;
