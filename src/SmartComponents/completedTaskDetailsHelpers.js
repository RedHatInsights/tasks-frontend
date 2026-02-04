import { fetchExecutedTask, fetchExecutedTaskJobs } from '../../api';
import {
  JOB_FAILED_MESSAGE,
  JOB_RUNNING_MESSAGE,
  JOB_TIMED_OUT_MESSAGE,
} from '../constants';

export const getSelectedSystems = (completedTaskJobs) => {
  let systemIds = [];
  completedTaskJobs.forEach((job) => {
    if (job.display_name) {
      systemIds.push(job.system);
    }
  });

  return systemIds;
};

export const isError = (result) => {
  const statusString = result?.response?.status.toString();
  return result?.response?.status && statusString[0] !== '2';
};

export const createNotification = (result, addNotification) => {
  addNotification({
    variant: 'danger',
    title: 'Error',
    description: result.message,
    dismissable: true,
  });
};

export const fetchTask = async (id, setError, addNotification) => {
  let taskDetails = await fetchExecutedTask(id);

  if (isError(taskDetails)) {
    createNotification(taskDetails, addNotification);
    setError(taskDetails);
  } else {
    return taskDetails;
  }
};

export const fetchTaskJobs = async (taskDetails, setError, addNotification) => {
  let path = `?limit=1000&offset=0`;
  const taskJobs = await fetchExecutedTaskJobs(taskDetails.id, path);

  if (isError(taskJobs)) {
    createNotification(taskJobs, addNotification);
    setError(taskJobs);
  } else {
    taskDetails.alerts_count =
      taskJobs.data.filter((item) => {
        if (
          item.status === 'Timeout' ||
          item.status === 'Failure' ||
          item.results.alert === 'true' ||
          item.results.alert === true
        ) {
          return item;
        }
      }).length || '-';
    taskDetails.system_count = taskJobs.data.length;
    taskJobs.data.forEach((job) => {
      if (job.status === 'Failure' && !job.results.message) {
        job.results.message = JOB_FAILED_MESSAGE;
      } else if (job.status === 'Timeout') {
        job.results.message = JOB_TIMED_OUT_MESSAGE;
      } else if (job.status === 'Running') {
        job.results.message = JOB_RUNNING_MESSAGE;
      }
    });

    return taskJobs.data;
  }
};

export const hasDetails = (completedTaskJob) => {
  return (
    completedTaskJob.results?.report_json?.entries?.length ||
    completedTaskJob.results?.report
  );
};
