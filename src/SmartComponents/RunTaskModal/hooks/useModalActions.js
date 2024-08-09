import React from 'react';
import { Button } from '@patternfly/react-core';
import ExecuteTaskButton from '../../../PresentationalComponents/ExecuteTaskButton/ExecuteTaskButton';

export const useModalActions = (
  areSystemsSelected,
  cancelModal,
  selectedIds,
  setExecuteTaskResult,
  slug,
  taskName,
  setAreSystemsSelected,
  parameters,
  definedParameters
) => {
  const checkForSystemsAndTaskName = () => {
    return !selectedIds?.length || !taskName.trim().length;
  };

  const nextButton = parameters?.length && !areSystemsSelected && (
    <Button
      key="next"
      aria-label={`${slug}-next-button`}
      variant="primary"
      isDisabled={checkForSystemsAndTaskName()}
      onClick={() => setAreSystemsSelected(true)}
    >
      Next
    </Button>
  );

  const executeButton = (!parameters?.length || areSystemsSelected) && (
    <ExecuteTaskButton
      key="execute-task-button"
      ids={selectedIds}
      isDisabled={
        definedParameters && definedParameters?.length
          ? definedParameters.some((param) => param.validated === false)
          : checkForSystemsAndTaskName()
      }
      definedParameters={definedParameters?.length ? definedParameters : null}
      setExecuteTaskResult={setExecuteTaskResult}
      slug={slug}
      taskName={taskName}
      variant="primary"
    />
  );

  const goBackButton = parameters?.length && areSystemsSelected && (
    <Button
      key="go-back"
      aria-label="go-back-button"
      variant="link"
      onClick={() => setAreSystemsSelected(false)}
    >
      Go back
    </Button>
  );

  const cancelButton = (
    <Button
      key="cancel-execute-task-button"
      variant="link"
      aria-label="cancel-run-task-modal"
      onClick={() => cancelModal()}
    >
      Cancel
    </Button>
  );

  return [
    nextButton !== 0 && nextButton,
    executeButton !== 0 && executeButton,
    goBackButton !== 0 && goBackButton,
    cancelButton,
  ];
};
