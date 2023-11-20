import React, { useEffect, useState } from 'react';
import { Modal } from '@patternfly/react-core/dist/js/components/Modal';
import propTypes from 'prop-types';
import { dispatchNotification } from '../../Utilities/Dispatcher';
import { EXECUTE_TASK_NOTIFICATION } from '../../constants';
import { isError } from '../completedTaskDetailsHelpers';
import RunTaskModalBody from './RunTaskModalBody';
import { useModalActions } from './hooks/useModalActions';

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

  const actions = useModalActions(
    areSystemsSelected,
    cancelModal,
    selectedIds,
    setExecuteTaskResult,
    slug,
    taskName,
    setAreSystemsSelected,
    parameters,
    definedParameters
  );

  return (
    <Modal
      aria-label="run-task-modal"
      title={title || 'Error'}
      isOpen={isOpen}
      onClose={() => setModalOpened(false)}
      width={'70%'}
      actions={actions}
      position="top"
    >
      <RunTaskModalBody
        areSystemsSelected={areSystemsSelected}
        createTaskError={createTaskError}
        description={description}
        error={error}
        parameters={parameters}
        selectedIds={selectedIds}
        setDefinedParameters={setDefinedParameters}
        setSelectedIds={setSelectedIds}
        setTaskName={setTaskName}
        slug={slug}
        taskName={taskName}
      />
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
