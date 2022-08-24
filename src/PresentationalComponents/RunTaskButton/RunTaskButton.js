import React from 'react';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';

const RunTaskButton = ({
  classname,
  isFirst,
  openTaskModal,
  slug,
  variant,
}) => {
  return (
    <Button
      aria-label={`${slug}-run-task-button`}
      className={classname}
      variant={variant}
      onClick={() => openTaskModal(true)}
    >
      {isFirst ? 'Run task' : 'Run task again'}
    </Button>
  );
};

RunTaskButton.propTypes = {
  classname: propTypes.string,
  isFirst: propTypes.bool,
  openTaskModal: propTypes.func,
  slug: propTypes.string,
  variant: propTypes.string,
};

export default RunTaskButton;
