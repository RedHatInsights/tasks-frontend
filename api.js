import axios from 'axios';
import { TASKS_API_ROOT, EXECUTED_TASKS_ROOT } from './src/constants';

const getExecutedTasks = async (path) => {
  const request = await axios.get(TASKS_API_ROOT.concat(path));

  return request.data;
};

export const fetchExecutedTasks = () => {
  return getExecutedTasks(EXECUTED_TASKS_ROOT);
};
