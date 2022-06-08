import React from 'react';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';

const RunTaskButton = ({ task, isFirst, openTaskModal, variant }) => {
  return (
    <Button variant={variant} onClick={() => openTaskModal(task)}>
      {isFirst ? 'Run task' : 'Run task again'}
    </Button>
  );
};

RunTaskButton.propTypes = {
  task: propTypes.object,
  isFirst: propTypes.bool,
  openTaskModal: propTypes.func,
  variant: propTypes.string,
};

export default RunTaskButton;
