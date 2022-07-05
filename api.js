import axios from 'axios';
import {
  TASKS_API_ROOT,
  AVAILABLE_TASKS_ROOT,
  EXECUTED_TASK_ROOT,
  SYSTEMS_ROOT,
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

export const fetchAvailableTasks = () => {
  return getTasks(AVAILABLE_TASKS_ROOT);
};

export const fetchAvailableTask = (slug) => {
  return getTasks(AVAILABLE_TASKS_ROOT.concat(`/${slug}`));
};

export const fetchExecutedTasks = () => {
  return getTasks(EXECUTED_TASK_ROOT);
};

export const fetchExecutedTask = (id, jobs_path = '') => {
  let idPath = `/${id}${jobs_path}`;
  return getTasks(EXECUTED_TASK_ROOT.concat(idPath));
};

export const fetchExecutedTaskJobs = (id) => {
  return fetchExecutedTask(id, '/jobs');
};

export const fetchSystems = (path) => {
  return getTasks(SYSTEMS_ROOT.concat(path));
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
