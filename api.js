import axios from 'axios';
import {
  TASKS_API_ROOT,
  AVAILABLE_TASKS_ROOT,
  EXECUTED_TASK_ROOT,
  SYSTEMS_ROOT,
  JOB_ROOT,
} from './src/constants';

const returnErrOrData = (response) => {
  if (response.status === 200) {
    return response.data;
  } else {
    return response;
  }
};

const getTasks = async (path) => {
  const response = await axios
    .get(TASKS_API_ROOT.concat(path))
    .catch(function (error) {
      return error;
    });

  return returnErrOrData(response);
};

const postTask = async (path, data) => {
  const response = await axios
    .post(TASKS_API_ROOT.concat(path), data)
    .catch(function (error) {
      return error;
    });

  return returnErrOrData(response);
};

const deleteTask = async (path) => {
  const response = await axios
    .delete(TASKS_API_ROOT.concat(path))
    .catch(function (error) {
      return error;
    });

  return returnErrOrData(response);
};

export const fetchAvailableTasks = (path = '') => {
  return getTasks(AVAILABLE_TASKS_ROOT.concat(path));
};

export const fetchAvailableTask = (slug) => {
  return getTasks(AVAILABLE_TASKS_ROOT.concat(`/${slug}`));
};

export const fetchExecutedTasks = (path) => {
  if (path) {
    return getTasks(EXECUTED_TASK_ROOT.concat(path));
  } else {
    return getTasks(EXECUTED_TASK_ROOT);
  }
};

export const fetchExecutedTask = (id, jobs_path = '') => {
  let idPath = `/${id}${jobs_path}`;
  return getTasks(EXECUTED_TASK_ROOT.concat(idPath));
};

export const fetchExecutedTaskJobs = (id, path) => {
  return fetchExecutedTask(id, `/jobs${path}`);
};

export const fetchSystems = (path = '', slug = '') => {
  if (slug) {
    return getTasks(AVAILABLE_TASKS_ROOT.concat(`/${slug}/systems${path}`));
  } else {
    return getTasks(SYSTEMS_ROOT.concat(path));
  }
};

export const executeTask = (body) => {
  return postTask(EXECUTED_TASK_ROOT, body);
};

export const deleteExecutedTask = (id) => {
  return deleteTask(EXECUTED_TASK_ROOT.concat(`/${id}`));
};

export const cancelExecutedTask = (id) => {
  return postTask(EXECUTED_TASK_ROOT.concat(`/${id}/cancel`));
};

export const getLogs = (id) => {
  return getTasks(JOB_ROOT.concat(`/${id}/stdout`))
};
