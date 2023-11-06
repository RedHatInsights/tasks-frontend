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
  const buildApiBody = () => {
    let apiBody = {
      task: slug,
      hosts: ids,
      name: taskName,
    };

    if (definedParameters) {
      apiBody.parameters = definedParameters.map((param) => {
        return { key: param.key, value: param.value };
      });
    }

    return apiBody;
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
