import React from 'react';
import { Button, Modal } from '@patternfly/react-core';
import propTypes from 'prop-types';
import {
  CANCEL_NON_SATELLITE_TASK_BODY,
  CANCEL_TASK_BODY,
  CANCEL_TASK_ERROR,
  DELETE_TASK_BODY,
  DELETE_TASK_ERROR,
  EXISTING_RESULTS_STRING,
} from '../../constants';
import { cancelExecutedTask, deleteExecutedTask } from '../../../api';
import { dispatchNotification } from '../../Utilities/Dispatcher';
import { isError } from '../../SmartComponents/completedTaskDetailsHelpers';

const DeleteCancelTaskModal = ({
  id,
  isOnlySatelliteConnected,
  isOpen,
  setIsCancel,
  setIsDelete,
  setModalOpened,
  startTime,
  status,
  title,
}) => {
  const createNotification = (message) => {
    dispatchNotification({
      variant: 'danger',
      title: message(title),
      description: 'Please try again',
      dismissable: true,
      autoDismiss: false,
    });
  };

  const handleTask = async (apiCall, ERROR, setType) => {
    const result = await apiCall(id);
    setModalOpened(false);
    if (isError(result)) {
      createNotification(ERROR);
    } else {
      setType(true);
    }
  };

  const renderButtons = () => {
    let actions = [
      <Button
        aria-label="delete-task-button"
        key="delete-task-button"
        ouiaId="delete-task-modal-button"
        variant="danger"
        onClick={() =>
          handleTask(deleteExecutedTask, DELETE_TASK_ERROR, setIsDelete)
        }
      >
        Delete task
      </Button>,
      <Button
        aria-label="cancel-delete-modal-button"
        key="cancel"
        ouiaId="cancel-delete-modal-button"
        variant="link"
        onClick={() => setModalOpened(false)}
      >
        Cancel
      </Button>,
    ];

    if (status === 'Running') {
      actions = [
        <Button
          key="cancel-task-button"
          ouiaId="cancel-task-modal-button"
          variant="danger"
          onClick={() =>
            handleTask(cancelExecutedTask, CANCEL_TASK_ERROR, setIsCancel)
          }
        >
          Cancel task
        </Button>,
        <Button
          key="cancel-delete-task-button"
          ouiaId="cancel-delete-task-modal-button"
          variant="danger"
          onClick={() =>
            handleTask(deleteExecutedTask, DELETE_TASK_ERROR, setIsDelete)
          }
        >
          Cancel task and delete result
        </Button>,
        <Button
          key="cancel"
          ouiaId="cancel-delete-modal-button"
          variant="link"
          onClick={() => setModalOpened(false)}
        >
          Cancel
        </Button>,
      ];
    }

    return actions;
  };

  const renderCancelBody = () => {
    return (
      <div>
        <span>
          {isOnlySatelliteConnected
            ? CANCEL_TASK_BODY(startTime, title)
            : CANCEL_NON_SATELLITE_TASK_BODY(startTime, title)}
        </span>
        <br />
        <br />
        <span>{EXISTING_RESULTS_STRING()}</span>
      </div>
    );
  };

  return (
    <Modal
      aria-label="cancel-delete-task-modal"
      title={`${status === 'Running' ? 'Cancel' : 'Delete'} this task?`}
      titleIconVariant="warning"
      isOpen={isOpen}
      onClose={() => setModalOpened(false)}
      width={'50%'}
      actions={renderButtons()}
    >
      {status === 'Running'
        ? renderCancelBody()
        : DELETE_TASK_BODY(startTime, title)}
    </Modal>
  );
};

DeleteCancelTaskModal.propTypes = {
  id: propTypes.number,
  isOnlySatelliteConnected: propTypes.bool,
  isOpen: propTypes.bool,
  setIsCancel: propTypes.func,
  setIsDelete: propTypes.func,
  setModalOpened: propTypes.func,
  startTime: propTypes.string,
  status: propTypes.string,
  title: propTypes.string,
};

export default DeleteCancelTaskModal;
