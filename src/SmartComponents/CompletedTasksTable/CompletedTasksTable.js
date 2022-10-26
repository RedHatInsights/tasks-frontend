import React, { useState, useEffect } from 'react';
import { ExclamationCircleIcon, WrenchIcon } from '@patternfly/react-icons';
import columns, { exportableColumns } from './Columns';
import * as Filters from './Filters';
import { renderRunDateTime } from '../../Utilities/helpers';
import {
  COMPLETED_TASKS_ERROR,
  COMPLETED_TASKS_TABLE_DEFAULTS,
  EMPTY_COMPLETED_TASKS_MESSAGE,
  EMPTY_COMPLETED_TASKS_TITLE,
  LOADING_COMPLETED_TASKS_TABLE,
  TASK_LOADING_CONTENT,
  TASKS_TABLE_DEFAULTS,
} from '../../constants';
import { fetchExecutedTasks } from '../../../api';
import { emptyRows } from '../../PresentationalComponents/NoResultsTable/NoResultsTable';
import TasksTables from '../../Utilities/hooks/useTableTools/Components/TasksTables';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import DeleteCancelTaskModal from '../../PresentationalComponents/DeleteCancelTaskModal/DeleteCancelTaskModal';
import useActionResolver from './hooks/useActionResolvers';
import {
  createNotification,
  fetchTask,
  fetchTaskJobs,
  getSelectedSystems,
  isError,
} from '../completedTaskDetailsHelpers';
import RunTaskModal from '../RunTaskModal/RunTaskModal';

const CompletedTasksTable = () => {
  const filters = Object.values(Filters);
  const [completedTasks, setCompletedTasks] = useState(
    LOADING_COMPLETED_TASKS_TABLE
  );
  const [completedTaskDetails, setCompletedTaskDetails] =
    useState(TASK_LOADING_CONTENT);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState();
  const [taskError, setTaskError] = useState();
  const [isDelete, setIsDelete] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isRunTaskAgain, setIsRunTaskAgain] = useState(false);
  const [isDeleteCancelModalOpened, setIsDeleteCancelModalOpened] =
    useState(false);
  const [taskDetails, setTaskDetails] = useState({});
  const [runTaskModalOpened, setRunTaskModalOpened] = useState(false);
  const [selectedSystems, setSelectedSystems] = useState([]);

  const fetchTaskDetails = async (id) => {
    setTaskError();
    setRunTaskModalOpened(true);
    const fetchedTaskDetails = await fetchTask(id, setTaskError);

    if (Object.keys(fetchedTaskDetails).length > 0) {
      const fetchedTaskJobs = await fetchTaskJobs(
        fetchedTaskDetails,
        setTaskError
      );

      if (fetchedTaskJobs.length) {
        setSelectedSystems(getSelectedSystems(fetchedTaskJobs));
        await setCompletedTaskDetails(fetchedTaskDetails);
      }
    } else {
      setRunTaskModalOpened(false);
      await setCompletedTaskDetails({});
    }
  };

  const fetchData = async () => {
    const path = `?limit=1000&offset=0`;
    const result = await fetchExecutedTasks(path);

    setTasks(result);
  };

  const handleCancelOrDeleteTask = async (task) => {
    await setTaskDetails(task);
    setIsDeleteCancelModalOpened(true);
  };

  const actionResolver = useActionResolver(
    handleCancelOrDeleteTask,
    fetchTaskDetails
  );

  const setTasks = async (result) => {
    if (isError(result)) {
      createNotification(result);
      setError(result);
    } else {
      result?.data?.map((task) =>
        task.status === 'Completed'
          ? (task.run_date_time = renderRunDateTime(task.end_time))
          : (task.run_date_time = task.status)
      );

      await setCompletedTasks(result.data);
      setTableLoading(false);
    }
  };

  const refetchData = async () => {
    setTableLoading(true);
    await setCompletedTasks(LOADING_COMPLETED_TASKS_TABLE);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(async () => {
    if (isDelete || isCancel) {
      await refetchData();
      setIsDelete(false);
      setIsCancel(false);
    } else if (isRunTaskAgain) {
      await refetchData();
      setIsRunTaskAgain(false);
    }
  }, [isCancel, isDelete, isRunTaskAgain]);

  return (
    <React.Fragment>
      <RunTaskModal
        description={completedTaskDetails.task_description}
        error={taskError}
        isOpen={runTaskModalOpened}
        selectedSystems={selectedSystems}
        setIsRunTaskAgain={setIsRunTaskAgain}
        setModalOpened={setRunTaskModalOpened}
        slug={completedTaskDetails.task_slug}
        title={completedTaskDetails.task_title}
      />
      <DeleteCancelTaskModal
        id={taskDetails.id}
        isOpen={isDeleteCancelModalOpened}
        setIsCancel={setIsCancel}
        setIsDelete={setIsDelete}
        setModalOpened={setIsDeleteCancelModalOpened}
        startTime={taskDetails.start_time}
        status={taskDetails.status}
        title={taskDetails.task_title}
      />
      <div aria-label="completed-tasks">
        {error ? (
          <EmptyStateDisplay
            icon={ExclamationCircleIcon}
            color="#c9190b"
            title={'Completed tasks cannot be displayed'}
            text={COMPLETED_TASKS_ERROR}
            error={`Error ${error?.response?.status}: ${error?.message}`}
          />
        ) : completedTasks?.length === 0 ? (
          <EmptyStateDisplay
            icon={WrenchIcon}
            color="#6a6e73"
            title={EMPTY_COMPLETED_TASKS_TITLE}
            text={EMPTY_COMPLETED_TASKS_MESSAGE}
          />
        ) : (
          <TasksTables
            label="completed-tasks-table"
            ouiaId="completed-tasks-table"
            columns={columns}
            items={completedTasks}
            filters={{
              filterConfig: filters,
            }}
            options={{
              ...TASKS_TABLE_DEFAULTS,
              ...COMPLETED_TASKS_TABLE_DEFAULTS,
              actionResolver,
              exportable: {
                ...TASKS_TABLE_DEFAULTS.exportable,
                columns: exportableColumns,
              },
            }}
            emptyRows={emptyRows('tasks')}
            isStickyHeader
            isTableLoading={tableLoading}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default CompletedTasksTable;
