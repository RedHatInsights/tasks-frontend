import {
  getSelectedSystems,
  isError,
  fetchTask,
  fetchTaskJobs,
} from '../completedTaskDetailsHelpers';
import {
  log4j_task_jobs,
  jobs_with_deleted_system,
} from '../CompletedTaskDetails/__tests__/__fixtures__/completedTasksDetails.fixtures';
import {
  errorResponse,
  log4j_task_jobs_systems,
  jobs_systems_no_display,
  successResponse,
  taskJobsSuccess,
} from './__fixtures__/completedTaskDetailsHelpers.fixtures';
import { fetchExecutedTask, fetchExecutedTaskJobs } from '../../../api';

jest.mock('../../../api');

describe('getSelectedSystems', () => {
  it('should return systems', () => {
    let selectedSystems = getSelectedSystems(log4j_task_jobs);
    expect(selectedSystems).toEqual(log4j_task_jobs_systems);
  });

  it('should return no systems', () => {
    let selectedSystems = getSelectedSystems([]);
    expect(selectedSystems).toEqual([]);
  });

  it('should return only systems with names', () => {
    let selectedSystems = getSelectedSystems(jobs_with_deleted_system);
    expect(selectedSystems).toEqual(jobs_systems_no_display);
  });
});

describe('isError', () => {
  it('should return true', () => {
    expect(isError(errorResponse)).toEqual(true);
  });

  it('should return false', () => {
    expect(isError(successResponse)).toEqual(false);
  });
});

describe('fetchTask', () => {
  const setError = jest.fn();
  const addNotification = jest.fn();

  it('should return fetched data', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return successResponse;
    });

    let taskDetails = await fetchTask('abcd1234', setError, addNotification);

    expect(taskDetails).toEqual(successResponse);
  });

  it('should set error on failed fetch', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return errorResponse;
    });

    await fetchTask('abcd1234', setError, addNotification);

    expect(setError).toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalled();
  });
});

describe('fetchTaskJobs', () => {
  const setError = jest.fn();
  const addNotification = jest.fn();

  it('should return fetched data', async () => {
    fetchExecutedTaskJobs.mockImplementation(async () => {
      return taskJobsSuccess;
    });

    let taskJobs = await fetchTaskJobs(
      { id: 'abcd1234' },
      setError,
      addNotification
    );
    expect(taskJobs).toBe(taskJobsSuccess.data);
  });

  it('should set error on failed fetch task jobs', async () => {
    fetchExecutedTaskJobs.mockImplementation(async () => {
      return errorResponse;
    });

    await fetchTaskJobs({ id: 'abcd1234' }, setError, addNotification);
    expect(setError).toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalled();
  });
});
