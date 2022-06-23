import axios from 'axios';
import {
  TASKS_API_ROOT,
  AVAILABLE_TASKS_ROOT,
  EXECUTED_TASKS_ROOT,
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

export const fetchAvailableTasks = () => {
  return getTasks(AVAILABLE_TASKS_ROOT);
};

export const fetchAvailableTask = (slug) => {
  return getTasks(AVAILABLE_TASKS_ROOT.concat(`/${slug}`));
};

export const fetchExecutedTasks = () => {
  return getTasks(EXECUTED_TASKS_ROOT);
};

export const fetchExecutedTask = (path) => {
  return getTasks(EXECUTED_TASKS_ROOT.concat(path));
};

export const fetchExecutedTaskJobs = (id) => {
  let idPath = `/${id}`;
  return fetchExecutedTask(idPath.concat('/jobs'));
};

export const fetchSystems = (path) => {
  return getTasks(SYSTEMS_ROOT.concat(path));
};
