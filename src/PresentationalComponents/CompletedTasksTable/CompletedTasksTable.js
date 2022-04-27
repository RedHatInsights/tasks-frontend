import React /*useState, useEffect*/ from 'react';
import TasksTables from '../../Utilities/hooks/useTableTools/Components/TasksTables';
import columns from './Columns';
//import { fetchExecutedTasks } from '../../../api';
import { completedTasksTableItems } from '../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';

const CompletedTasksTable = () => {
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
      //items={completedTasks}
      //emptyRows={emptyRows}
      isStickyHeader
    />
  );
};

export default CompletedTasksTable;
