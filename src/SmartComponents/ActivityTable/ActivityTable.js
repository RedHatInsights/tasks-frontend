import React, { useState, useEffect } from 'react';

import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';
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
import { useInterval } from '../../Utilities/hooks/useTableTools/useInterval';
import {
  createNotification,
  fetchTask,
  fetchTaskJobs,
  getSelectedSystems,
  isError,
} from '../completedTaskDetailsHelpers';
import RunTaskModal from '../RunTaskModal/RunTaskModal';
import RefreshFooterContent from '../RefreshFooterContent';

const ActivityTable = () => {
  const addNotification = useAddNotification();
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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState({ index: 3, direction: 'desc' });

  const fetchTaskDetails = async (id) => {
    setTaskError();
    setRunTaskModalOpened(true);
    const fetchedTaskDetails = await fetchTask(
      id,
      setTaskError,
      addNotification,
    );

    if (Object.keys(fetchedTaskDetails).length > 0) {
      const fetchedTaskJobs = await fetchTaskJobs(
        fetchedTaskDetails,
        setTaskError,
        addNotification,
      );

      setSelectedSystems(getSelectedSystems(fetchedTaskJobs));
      await setActivityDetails(fetchedTaskDetails);
    } else {
      setRunTaskModalOpened(false);
      await setActivityDetails({});
    }
  };

  /**
   * Maps column index to API sort field name
   *  @param   {number} columnIndex - Column index (0-based)
   *  @returns {string}             API field name for sorting
   */
  const getApiSortField = (columnIndex) => {
    const sortFields = ['name', 'systems_count', 'status', 'start_time'];
    return sortFields[columnIndex] || 'start_time';
  };

  /**
   * Fetches a single page of tasks from the server using server-side pagination
   *  @param   {number}        pageNum  - Current page number (1-indexed)
   *  @param   {number}        pageSize - Number of items per page
   *  @returns {Promise<void>}
   */
  const fetchData = async (pageNum, pageSize) => {
    const offset = (pageNum - 1) * pageSize;
    const sortField = getApiSortField(sortBy.index);
    const sortParam = sortBy.direction === 'desc' ? `-${sortField}` : sortField;
    const result = await fetchExecutedTasks(
      `?limit=${pageSize}&offset=${offset}&sort=${sortParam}`,
    );

    if (isError(result)) {
      createNotification(result, addNotification);
      setError(result);
      setActivities([]);
      setTableLoading(false);
    } else {
      const tasks = result.data || [];

      if (tasks.some((task) => task.status === 'Running')) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }

      setTotal(result.meta?.count || 0);
      setTasks(tasks);
    }
  };

  const handleCancelOrDeleteTask = async (task) => {
    await setTaskDetails(task);
    setIsDeleteCancelModalOpened(true);
  };

  const actionResolver = useActionResolver(
    handleCancelOrDeleteTask,
    fetchTaskDetails,
  );

  /**
   * Handles sort changes - updates sort state and resets to page 1
   *  @param   {*}      _         - Unused event parameter
   *  @param   {number} index     - Column index being sorted
   *  @param   {string} direction - Sort direction ('asc' or 'desc')
   *  @returns {void}
   */
  const handleSort = (_, index, direction) => {
    setSortBy({ index, direction });
    setPage(1);
  };

  /**
   * Sets tasks data and updates run_date_time for display
   *  @param   {Array}         result - Array of task objects
   *  @returns {Promise<void>}
   */
  const setTasks = async (result) => {
    result?.map(
      (task) => (task.run_date_time = renderRunDateTime(task.start_time)),
    );

    await setActivities(result);
    setTableLoading(false);
  };

  /**
   * Refetches the current page of data and resets table loading state
   *  @returns {Promise<void>}
   */
  const refetchData = async () => {
    setTableLoading(true);
    await setActivities(LOADING_ACTIVITIES_TABLE);
    fetchCurrentPage();
  };

  /**
   * Fetches the current page based on state values (page, perPage)
   * Updates lastUpdated timestamp
   *  @returns {Promise<void>}
   */
  const fetchCurrentPage = async () => {
    setLastUpdated(new Date());
    await fetchData(page, perPage);
  };

  useEffect(() => {
    fetchCurrentPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, sortBy]);

  useInterval(() => {
    if (isRunning) {
      fetchCurrentPage();
    }
  }, 60000);

  useEffect(() => {
    if (isDelete || isCancel) {
      refetchData();
      setIsDelete(false);
      setIsCancel(false);
    } else if (isRunTaskAgain) {
      refetchData();
      setIsRunTaskAgain(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetchData is stable
  }, [isCancel, isDelete, isRunTaskAgain]);

  return (
    <React.Fragment>
      {runTaskModalOpened && (
        <RunTaskModal
          description={activityDetails.task_description}
          error={taskError}
          isOpen={runTaskModalOpened}
          parameters={activityDetails.parameters}
          selectedSystems={selectedSystems}
          setIsRunTaskAgain={setIsRunTaskAgain}
          setModalOpened={setRunTaskModalOpened}
          slug={activityDetails.task_slug}
          title={activityDetails.task_title}
          name={activityDetails.name}
          filterMessage={activityDetails.task_filter_message}
        />
      )}
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
              ...TASKS_TABLE_DEFAULTS(addNotification),
              ...COMPLETED_TASKS_TABLE_DEFAULTS,
              actionResolver,
              exportable: {
                ...TASKS_TABLE_DEFAULTS(addNotification).exportable,
                columns: exportableColumns,
              },
              perPage,
              pagination: {
                page,
                perPage,
                itemCount: total,
                onSetPage: (_, newPage) => setPage(newPage),
                onPerPageSelect: (_, newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                },
              },
              sortBy,
              onSort: handleSort,
            }}
            emptyRows={emptyRows('tasks')}
            isStickyHeader
            isTableLoading={tableLoading}
            footerContent={
              <RefreshFooterContent
                date={lastUpdated}
                isRunning={isRunning}
                type="tasks"
              />
            }
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default ActivityTable;
