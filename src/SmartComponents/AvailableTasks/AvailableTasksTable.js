import React from 'react';
import propTypes from 'prop-types';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  EMPTY_TASKS_MESSAGE,
  EMPTY_TASKS_TITLE,
  TASKS_ERROR,
} from '../../constants';
import { TaskCard } from './TaskCard';

const AvailableTasksTable = ({ availableTasks, error, openTaskModal }) => {
  return (
    <div aria-label="available-tasks-table">
      {error ? (
        <EmptyStateDisplay
          icon={ExclamationCircleIcon}
          color="#c9190b"
          title={'Available tasks cannot be displayed'}
          text={TASKS_ERROR}
          error={`Error ${error?.response?.status}: ${error?.message}`}
        />
      ) : !availableTasks?.length ? (
        <EmptyStateDisplay
          title={EMPTY_TASKS_TITLE}
          text={EMPTY_TASKS_MESSAGE}
        />
      ) : (
        availableTasks?.map((task, index) => (
          <TaskCard task={task} key={index} openTaskModal={openTaskModal} />
        ))
      )}
    </div>
  );
};

AvailableTasksTable.propTypes = {
  availableTasks: propTypes.array,
  error: propTypes.object,
  openTaskModal: propTypes.func,
};

export default AvailableTasksTable;
