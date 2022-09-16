import { dispatchNotification } from '../Utilities/Dispatcher';
import { fetchExecutedTask, fetchExecutedTaskJobs } from '../../api';

export const getSelectedSystems = (completedTaskJobs) => {
  return completedTaskJobs.map((job) => job.system);
};

export const isError = (result) => {
  const statusString = result?.response?.status.toString();
  return result?.response?.status && statusString[0] !== '2';
};

export const createNotification = (result) => {
  dispatchNotification({
    variant: 'danger',
    title: 'Error',
    description: result.message,
    dismissable: true,
    autoDismiss: false,
  });
};

export const fetchTask = async (id, setError) => {
  let taskDetails = await fetchExecutedTask(id);

  if (isError(taskDetails)) {
    createNotification(taskDetails);
    setError(taskDetails);
  } else {
    return taskDetails;
  }
};

export const fetchTaskJobs = async (taskDetails, setError) => {
  let path = `?limit=1000&offset=0`;
  const taskJobs = await fetchExecutedTaskJobs(taskDetails.id, path);

  if (isError(taskJobs)) {
    createNotification(taskJobs);
    setError(taskJobs);
  } else {
    taskDetails.messages_count = taskJobs.data.filter((item) => {
      return item.results.message !== 'No vulnerability found.';
    }).length;
    taskDetails.system_count = taskJobs.data.length;
    return taskJobs.data;
  }
};

export const onlySatelliteConnected = (jobs) => {
  return !jobs.some((job) => job.connection_type !== 'satellite');
};
