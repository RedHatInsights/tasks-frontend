import React /*useState, useEffect*/ from 'react';
import TasksTables from '../../Utilities/hooks/useTableTools/Components/TasksTables';
import columns, { exportableColumns } from './Columns';
//import { fetchExecutedTasks } from '../../../api';
import { completedTasksTableItems } from '../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import * as Filters from './Filters';
import { TASKS_TABLE_DEFAULTS } from '../../constants';

const CompletedTasksTable = () => {
  const filters = Object.values(Filters);
  //const [completedTasks, setCompletedTasks] = useState(items);

  /*useEffect(() => {
    const fetchData = () => {
      const result = fetchExecutedTasks();

      setCompletedTasks(result);
    };

    fetchData();
  }, []);*/

  return (
    <TasksTables
      label="completed-tasks"
      ouiaId="completed-tasks-table"
      columns={columns}
      items={completedTasksTableItems}
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
      //items={completedTasks}
      //emptyRows={emptyRows}
      isStickyHeader
    />
  );
};

export default CompletedTasksTable;
