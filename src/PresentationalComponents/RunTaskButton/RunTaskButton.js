import React from 'react';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';

const RunTaskButton = ({
  classname,
  task,
  isFirst,
  openTaskModal,
  variant,
}) => {
  return (
    <Button
      aria-label={`${task.slug}-run-task-button`}
      className={classname}
      variant={variant}
      onClick={() => openTaskModal(task)}
    >
      {isFirst ? 'Run task' : 'Run task again'}
    </Button>
  );
};

RunTaskButton.propTypes = {
  classname: propTypes.string,
  task: propTypes.object,
  isFirst: propTypes.bool,
  openTaskModal: propTypes.func,
  variant: propTypes.string,
};

export default RunTaskButton;
