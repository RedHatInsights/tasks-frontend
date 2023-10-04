import React from 'react';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { executeTask } from '../../../api';

const ExecuteTaskButton = ({
  classname,
  ids,
  setExecuteTaskResult,
  slug,
  taskName,
  variant,
}) => {
  const buildApiBody = () => {
    return {
      task: slug,
      hosts: ids,
      name: taskName,
    };
  };

  const submitTask = async () => {
    let result = await executeTask(buildApiBody());
    setExecuteTaskResult(result);
  };

  return (
    <Button
      aria-label={`${slug}-submit-task-button`}
      className={classname}
      variant={variant}
      onClick={() => submitTask()}
      isDisabled={!ids?.length}
    >
      Execute task
    </Button>
  );
};

ExecuteTaskButton.propTypes = {
  classname: propTypes.string,
  ids: propTypes.array,
  setExecuteTaskResult: propTypes.func,
  slug: propTypes.string,
  taskName: propTypes.string,
  variant: propTypes.string,
};

export default ExecuteTaskButton;
