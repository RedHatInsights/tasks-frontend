const useActionResolver = (handleTask, fetchTaskDetails) => {
  const onClick = (funcCall, task) => {
    funcCall(task);
  };

  return (row) => [
    {
      title: 'Run this task again',
      onClick: (_event, _index, task) =>
        onClick(fetchTaskDetails, task.task.title.props.id),
    },
    {
      title: 'Delete',
      isDisabled: row.task.title.props.status !== 'Completed',
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
