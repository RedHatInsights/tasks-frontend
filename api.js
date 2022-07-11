import axios from 'axios';
import {
  TASKS_API_ROOT,
  AVAILABLE_TASKS_ROOT,
  EXECUTED_TASK_ROOT,
  SYSTEMS_ROOT,
} from './src/constants';

const getTasks = async (path) => {
  let response;
  const request = await axios
    .get(TASKS_API_ROOT.concat(path))
    .catch(function (error) {
      return error;
    });

  if (request.status === 200) {
    response = request.data;
  } else {
    response = request;
  }

  return response;
};

const postTask = async (path, data) => {
  let response;

  const request = await axios
    .post(TASKS_API_ROOT.concat(path), data)
    .catch(function (error) {
      return error;
    });

  if (request.status === 200) {
    response = request.data;
  } else {
    response = request;
  }

  return response;
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
