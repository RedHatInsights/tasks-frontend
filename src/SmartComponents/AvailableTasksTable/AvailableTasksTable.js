import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
//import { fetchAvailableTasks } from '../../../api';
import { availableTasksTableItems } from '../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import CardBuilder from '../../PresentationalComponents/CardBuilder/CardBuilder';
import {
  AVAILABLE_TASK_CARD_HEADER,
  AVAILABLE_TASK_CARD_BODY,
  AVAILABLE_TASK_CARD_FOOTER,
} from '../../constants';

const buildCardFuncArray = (openTaskModal) => {
  return [{ openTaskModal: openTaskModal }];
};

const AvailableTasksTable = ({ openTaskModal }) => {
  //const [availableTasks, setAvailableTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState(
    availableTasksTableItems
  );

  useEffect(() => {
    const fetchData = () => {
      //const result = fetchAvailableTasks();
      const result = availableTasksTableItems;

      setAvailableTasks(result);
    };

    fetchData();
  }, []);

  return (
    <div aria-label="available-tasks">
      {availableTasks?.map((task) => {
        return (
          <React.Fragment key={task.title}>
            <CardBuilder
              data={task}
              cardHeader={AVAILABLE_TASK_CARD_HEADER}
              cardBody={AVAILABLE_TASK_CARD_BODY}
              cardFooter={AVAILABLE_TASK_CARD_FOOTER}
              actionFuncs={buildCardFuncArray(openTaskModal)}
            />
            <br />
          </React.Fragment>
        );
      })}
    </div>
  );
};

AvailableTasksTable.propTypes = {
  openTaskModal: propTypes.func,
};

export default AvailableTasksTable;
