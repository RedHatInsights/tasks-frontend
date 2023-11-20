import React from 'react';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { executeTask } from '../../../api';

const ExecuteTaskButton = ({
  classname,
  definedParameters,
  ids,
  isDisabled,
  setExecuteTaskResult,
  slug,
  taskName,
  variant,
}) => {
  const apiBody = {
    task: slug,
    hosts: ids,
    name: taskName,
    ...(definedParameters
      ? {
          parameters: definedParameters.map((param) => ({
            key: param.key,
            value: param.value,
          })),
        }
      : {}),
  };

  const submitTask = async () => {
    let result = await executeTask(apiBody);
    setExecuteTaskResult(result);
  };

  return (
    <Button
      aria-label={`${slug}-submit-task-button`}
      className={classname}
      variant={variant}
      onClick={() => submitTask()}
      isDisabled={isDisabled}
    >
      Execute task
    </Button>
  );
};

ExecuteTaskButton.propTypes = {
  classname: propTypes.string,
  definedParameters: propTypes.array,
  ids: propTypes.array,
  isDisabled: propTypes.func,
  setExecuteTaskResult: propTypes.func,
  slug: propTypes.string,
  taskName: propTypes.string,
  variant: propTypes.string,
};

export default ExecuteTaskButton;
