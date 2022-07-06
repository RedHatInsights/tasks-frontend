import React, { useState, useEffect } from 'react';
import { ExclamationCircleIcon, WrenchIcon } from '@patternfly/react-icons';
import columns, { exportableColumns } from './Columns';
import { fetchExecutedTasks } from '../../../api';
import * as Filters from './Filters';
import { renderRunDateTime } from '../../Utilities/helpers';
import {
  COMPLETED_TASKS_ERROR,
  EMPTY_COMPLETED_TASKS_MESSAGE,
  EMPTY_COMPLETED_TASKS_TITLE,
  LOADING_COMPLETED_TASKS_TABLE,
  TASKS_TABLE_DEFAULTS,
} from '../../constants';
import { emptyRows } from '../../PresentationalComponents/NoResultsTable/NoResultsTable';
import { dispatchNotification } from '../../Utilities/Dispatcher';
import TasksTables from '../../Utilities/hooks/useTableTools/Components/TasksTables';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import DeleteCancelTaskModal from '../../PresentationalComponents/DeleteCancelTaskModal/DeleteCancelTaskModal';
import useActionResolver from './hooks/useActionResolvers';

const CompletedTasksTable = () => {
  const filters = Object.values(Filters);
  const [completedTasks, setCompletedTasks] = useState(
    LOADING_COMPLETED_TASKS_TABLE
  );
  const [error, setError] = useState();
  const [isDelete, setIsDelete] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isDeleteCancelModalOpened, setIsDeleteCancelModalOpened] =
    useState(false);
  const [taskDetails, setTaskDetails] = useState({});

  const fetchData = async () => {
    const path = `?limit=1000&offset=0`;
    const result = await fetchExecutedTasks(path);

    setTasks(result);
  };

  const createNotification = (result) => {
    dispatchNotification({
      variant: 'danger',
      title: 'Error',
      description: result.message,
      dismissable: true,
      autoDismiss: false,
    });
  };

  const handleCancelOrDeleteTask = async (task) => {
    await setTaskDetails(task);
    setIsDeleteCancelModalOpened(true);
  };

  const actionResolver = useActionResolver(handleCancelOrDeleteTask);

  const setTasks = async (result) => {
    if (result?.response?.status && result?.response?.status !== 200) {
      createNotification(result);
      setError(result);
    } else {
      result.data.map((task) =>
        task.status === 'Completed'
          ? (task.run_date_time = renderRunDateTime(task.end_time))
          : (task.run_date_time = task.status)
      );

      await setCompletedTasks(result.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(async () => {
    if (isDelete || isCancel) {
      await setCompletedTasks(LOADING_COMPLETED_TASKS_TABLE);
      fetchData();
      setIsDelete(false);
      setIsCancel(false);
    }
  }, [isCancel, isDelete]);

  return (
    <React.Fragment>
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
        ) : completedTasks.length === 0 ? (
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
              actionResolver,
              exportable: {
                ...TASKS_TABLE_DEFAULTS.exportable,
                columns: exportableColumns,
              },
            }}
            emptyRows={emptyRows('tasks')}
            isStickyHeader
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default CompletedTasksTable;
