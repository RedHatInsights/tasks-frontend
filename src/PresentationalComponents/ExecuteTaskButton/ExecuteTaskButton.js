import React from 'react';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { executeTask } from '../../../api';
import { dispatchNotification } from '../../Utilities/Dispatcher';
import { EXECUTE_TASK_NOTIFICATION } from '../../constants';

const ExecuteTaskButton = ({
  classname,
  ids,
  setModalOpened,
  slug,
  title,
  variant,
}) => {
  const buildApiBody = () => {
    return {
      task: slug,
      hosts: ids,
    };
  };

  const submitTask = async () => {
    setModalOpened(false);

    let result = await executeTask(buildApiBody());
    if (result?.response?.status && result?.response?.status !== 200) {
      dispatchNotification({
        variant: 'danger',
        title: 'Error',
        description: result.message,
        dismissable: true,
        autoDismiss: false,
      });
    } else {
      EXECUTE_TASK_NOTIFICATION(title, ids, result.data.id);
    }
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
  setModalOpened: propTypes.func,
  slug: propTypes.string,
  title: propTypes.string,
  variant: propTypes.string,
};

export default ExecuteTaskButton;
