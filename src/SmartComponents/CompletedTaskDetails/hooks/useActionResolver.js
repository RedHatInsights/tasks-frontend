const useActionResolver = (
  setIsLogDrawerExpanded,
  setJobId,
  setJobName,
  navigateToInventory
) => {
  const handleOpenDrawer = (jobId, jobName) => {
    setJobId(jobId);
    setJobName(jobName);
    setIsLogDrawerExpanded(true);
  };

  return (row) => [
    {
      title: 'View system logs',
      isDisabled: !row.has_stdout,
      onClick: () => handleOpenDrawer(row.jobId, row.display_name),
    },
    {
      title: 'View system in Inventory',
      isDisabled: !row.display_name,
      onClick: () => navigateToInventory(`/${row.itemId}`),
    },
  ];
};

export default useActionResolver;
