import React, { useState, useEffect } from 'react';
import { ExclamationCircleIcon, WrenchIcon } from '@patternfly/react-icons';
import columns, { exportableColumns } from './Columns';
import { nameFilter, statusFilter } from './Filters';
import { renderRunDateTime } from '../../Utilities/helpers';
import {
  COMPLETED_TASKS_ERROR,
  COMPLETED_TASKS_TABLE_DEFAULTS,
  EMPTY_COMPLETED_TASKS_MESSAGE,
  EMPTY_COMPLETED_TASKS_TITLE,
  LOADING_ACTIVITIES_TABLE,
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
import usePromiseQueue from '../../Utilities/hooks/usePromiseQueue';

const ActivityTable = () => {
  const [activities, setActivities] = useState(LOADING_ACTIVITIES_TABLE);
  const [activityDetails, setActivityDetails] = useState(TASK_LOADING_CONTENT);
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
  const [totalTaskCount, setTotalTaskCount] = useState();

  const { resolve } = usePromiseQueue();

  const fetchTaskDetails = async (id) => {
    setTaskError();
    setRunTaskModalOpened(true);
    const fetchedTaskDetails = await fetchTask(id, setTaskError);

    if (Object.keys(fetchedTaskDetails).length > 0) {
      const fetchedTaskJobs = await fetchTaskJobs(
        fetchedTaskDetails,
        setTaskError
      );

      setSelectedSystems(getSelectedSystems(fetchedTaskJobs));
      await setActivityDetails(fetchedTaskDetails);
    } else {
      setRunTaskModalOpened(false);
      await setActivityDetails({});
    }
  };

  const fetchData = async () => {
    let results;
    const batchSize = 200;
    const pages = Math.ceil(totalTaskCount / batchSize) || 1;
    const result = await resolve(
      [...new Array(pages)].map(
        (_, pageIdx) => () =>
          fetchExecutedTasks(
            `?limit=${batchSize}&offset=${batchSize * pageIdx}`
          )
      )
    );

    if (isError(result[0])) {
      createNotification(result[0]);
      setError(result[0]);
    } else {
      results = result.map(({ data }) => data).flat();
    }

    setTasks(results);
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
    result?.map(
      (task) => (task.run_date_time = renderRunDateTime(task.start_time))
    );

    await setActivities(result);
    setTableLoading(false);
  };

  const refetchData = async () => {
    setTableLoading(true);
    await setActivities(LOADING_ACTIVITIES_TABLE);
    fetchData();
  };

  useEffect(() => {
    const fetchSingleTask = async () => {
      const task = await fetchExecutedTasks(`?limit=1&offset=0`);
      if (isError(task)) {
        createNotification(task);
        setError(task);
        setActivities([]);
      } else if (task.data.length === 0) {
        setActivities([]);
      } else {
        setTotalTaskCount(task.meta.count);
      }
    };

    fetchSingleTask();
  }, []);

  useEffect(() => {
    if (totalTaskCount) {
      fetchData();
    }
  }, [totalTaskCount]);

  useEffect(() => {
    if (isDelete || isCancel) {
      refetchData();
      setIsDelete(false);
      setIsCancel(false);
    } else if (isRunTaskAgain) {
      refetchData();
      setIsRunTaskAgain(false);
    }
  }, [isCancel, isDelete, isRunTaskAgain]);

  return (
    <React.Fragment>
      <RunTaskModal
        description={activityDetails.task_description}
        error={taskError}
        isOpen={runTaskModalOpened}
        selectedSystems={selectedSystems}
        setIsRunTaskAgain={setIsRunTaskAgain}
        setModalOpened={setRunTaskModalOpened}
        slug={activityDetails.task_slug}
        title={activityDetails.task_title}
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
      <div aria-label="activity">
        {error ? (
          <EmptyStateDisplay
            icon={ExclamationCircleIcon}
            color="#c9190b"
            title={'Activities cannot be displayed'}
            text={COMPLETED_TASKS_ERROR}
            error={`Error ${error?.response?.status}: ${error?.message}`}
          />
        ) : activities?.length === 0 ? (
          <EmptyStateDisplay
            icon={WrenchIcon}
            color="#6a6e73"
            title={EMPTY_COMPLETED_TASKS_TITLE}
            text={EMPTY_COMPLETED_TASKS_MESSAGE}
          />
        ) : (
          <TasksTables
            label="activity-table"
            ouiaId="activity-table"
            columns={columns}
            items={activities}
            filters={{
              filterConfig: [...nameFilter, ...statusFilter],
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

export default ActivityTable;
