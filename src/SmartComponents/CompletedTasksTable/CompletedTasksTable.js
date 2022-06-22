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

const CompletedTasksTable = () => {
  const filters = Object.values(Filters);
  const [completedTasks, setCompletedTasks] = useState(
    LOADING_COMPLETED_TASKS_TABLE
  );
  const [error, setError] = useState();

  const setTasks = async (result) => {
    if (result?.response?.status && result?.response?.status !== 200) {
      setError(result);
      dispatchNotification({
        variant: 'danger',
        title: 'Error',
        description: result.message,
        dismissable: true,
      });
    } else {
      result.data.map(
        (task) => (task.run_date_time = renderRunDateTime(task.end))
      );

      await setCompletedTasks(result.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchExecutedTasks();

      setTasks(result);
    };

    fetchData();
  }, []);

  return (
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
          ouiaId="completed-tasks-table"
          columns={columns}
          items={completedTasks}
          filters={{
            filterConfig: filters,
          }}
          options={{
            ...TASKS_TABLE_DEFAULTS,
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
  );
};

export default CompletedTasksTable;
