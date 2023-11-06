import React, { useEffect, useState } from 'react';
import { Button } from '@patternfly/react-core/dist/js/components/Button';
import { Modal } from '@patternfly/react-core/dist/js/components/Modal';
import propTypes from 'prop-types';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { TASK_ERROR } from '../../constants';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import ExecuteTaskButton from '../../PresentationalComponents/ExecuteTaskButton/ExecuteTaskButton';
import { dispatchNotification } from '../../Utilities/Dispatcher';
import { EXECUTE_TASK_NOTIFICATION } from '../../constants';
import { isError } from '../completedTaskDetailsHelpers';
import SystemsSelect from './SystemsSelect';
import InputParameters from './InputParameters';

const RunTaskModal = ({
  description,
  error,
  isOpen,
  name,
  parameters,
  selectedSystems,
  setIsRunTaskAgain,
  setModalOpened,
  slug,
  title,
}) => {
  const [selectedIds, setSelectedIds] = useState(selectedSystems);
  const [taskName, setTaskName] = useState(name);
  const [executeTaskResult, setExecuteTaskResult] = useState();
  const [createTaskError, setCreateTaskError] = useState({});
  const [areSystemsSelected, setAreSystemsSelected] = useState(false);
  const [definedParameters, setDefinedParameters] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(selectedSystems);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIds(selectedSystems);
  }, [selectedSystems]);

  useEffect(() => {
    if (name) {
      setTaskName(name);
    } else {
      setTaskName(title);
    }
  }, [title, name]);

  useEffect(() => {
    if (parameters) {
      setDefinedParameters(
        parameters.map((param) => {
          let definedParam = {
            key: param.key,
            value: param.default || param.value || '',
          };
          if (param.required) {
            definedParam.validated = definedParam.value.length ? true : false;
          }

          return definedParam;
        })
      );
    }
  }, [parameters]);

  useEffect(() => {
    if (executeTaskResult) {
      if (isError(executeTaskResult)) {
        setCreateTaskError(executeTaskResult.response);
        dispatchNotification({
          variant: 'danger',
          title: 'Error',
          description: executeTaskResult.message,
          dismissable: true,
          autoDismiss: false,
        });
      } else {
        if (setIsRunTaskAgain) {
          setIsRunTaskAgain(true);
        }
        EXECUTE_TASK_NOTIFICATION(
          taskName,
          selectedIds,
          executeTaskResult.data.id
        );
        setModalOpened(false);
      }
    }
  }, [executeTaskResult]);

  const cancelModal = () => {
    setSelectedIds([]);
    setTaskName(name || title);
    setModalOpened(false);
  };

  const checkForSystemsAndTaskName = () => {
    return !selectedIds?.length || !taskName.length;
  };

  const setModalButtons = () => {
    let actions;
    if (parameters?.length && !areSystemsSelected) {
      actions = [
        <Button
          key="next"
          aria-label="next-button"
          variant="primary"
          isDisabled={checkForSystemsAndTaskName()}
          onClick={() => setAreSystemsSelected(true)}
        >
          Next
        </Button>,
        <Button
          key="cancel-execute-task-button"
          aria-label="cancel-run-task-modal"
          variant="link"
          onClick={() => cancelModal()}
        >
          Cancel
        </Button>,
      ];
    } else if (!parameters?.length) {
      actions = [
        <ExecuteTaskButton
          key="execute-task-button"
          ids={selectedIds}
          isDisabled={checkForSystemsAndTaskName()}
          setExecuteTaskResult={setExecuteTaskResult}
          slug={slug}
          taskName={taskName}
          variant="primary"
        />,
        <Button
          key="cancel-execute-task-button"
          aria-label="cancel-run-task-modal"
          variant="link"
          onClick={() => cancelModal()}
        >
          Cancel
        </Button>,
      ];
    } else {
      actions = [
        <ExecuteTaskButton
          key="execute-task-button"
          definedParameters={
            definedParameters.length ? definedParameters : null
          }
          ids={selectedIds}
          isDisabled={definedParameters.some(
            (param) => param.validated === false
          )}
          setExecuteTaskResult={setExecuteTaskResult}
          slug={slug}
          taskName={taskName}
          variant="primary"
        />,
        <Button
          key="go-back"
          aria-label="go-back-button"
          variant="link"
          onClick={() => setAreSystemsSelected(false)}
        >
          Go back
        </Button>,
        <Button
          key="cancel-execute-task-button"
          variant="link"
          aria-label="cancel-run-task-modal"
          onClick={() => cancelModal()}
        >
          Cancel
        </Button>,
      ];
    }

    return actions;
  };

  const renderBody = () => {
    if (!areSystemsSelected) {
      return (
        <SystemsSelect
          createTaskError={createTaskError}
          description={description}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          setTaskName={setTaskName}
          slug={slug}
          taskName={taskName}
        />
      );
    } else {
      return (
        <InputParameters
          parameters={parameters}
          setDefinedParameters={setDefinedParameters}
        />
      );
    }
  };

  return (
    <Modal
      aria-label="run-task-modal"
      title={title || 'Error'}
      isOpen={isOpen}
      onClose={() => setModalOpened(false)}
      width={'70%'}
      actions={setModalButtons()}
      position="top"
    >
      {error ? (
        <EmptyStateDisplay
          icon={ExclamationCircleIcon}
          color="#c9190b"
          title={'This task cannot be displayed'}
          text={TASK_ERROR}
          error={`Error ${error?.response?.status}: ${error?.message}`}
        />
      ) : (
        renderBody()
      )}
    </Modal>
  );
};

RunTaskModal.propTypes = {
  description: propTypes.any,
  error: propTypes.object,
  isOpen: propTypes.bool,
  name: propTypes.string,
  parameters: propTypes.array,
  selectedSystems: propTypes.array,
  setIsRunTaskAgain: propTypes.func,
  setModalOpened: propTypes.func,
  slug: propTypes.string,
  title: propTypes.oneOfType([propTypes.string, propTypes.node]),
};

export default RunTaskModal;
