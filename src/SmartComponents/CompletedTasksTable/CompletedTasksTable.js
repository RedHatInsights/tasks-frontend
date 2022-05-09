import React, { useState, useEffect } from 'react';
import TasksTables from '../../Utilities/hooks/useTableTools/Components/TasksTables';
import columns, { exportableColumns } from './Columns';
//import { fetchExecutedTasks } from '../../../api';
import { completedTasksTableItems } from '../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import * as Filters from './Filters';
import { renderRunDateTime } from '../../Utilities/helpers';
import { TASKS_TABLE_DEFAULTS } from '../../constants';

const CompletedTasksTable = () => {
  const filters = Object.values(Filters);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      //const result = fetchExecutedTasks();
      const result = completedTasksTableItems;
      result.map((task) => (task.run_date_time = renderRunDateTime(task.end)));

      setCompletedTasks(result);
    };

    fetchData();
  }, []);

  return (
    <TasksTables
      label="completed-tasks"
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
      //emptyRows={emptyRows}
      isStickyHeader
    />
  );
};

export default CompletedTasksTable;
