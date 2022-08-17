import React from 'react';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { executeTask } from '../../../api';
import { dispatchNotification } from '../../Utilities/Dispatcher';
import { EXECUTE_TASK_NOTIFICATION } from '../../constants';
import { isError } from '../../SmartComponents/completedTaskDetailsHelpers';

const ExecuteTaskButton = ({
  classname,
  ids,
  setIsRunTaskAgain,
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
    if (isError(result)) {
      dispatchNotification({
        variant: 'danger',
        title: 'Error',
        description: result.message,
        dismissable: true,
        autoDismiss: false,
      });
    } else {
      if (setIsRunTaskAgain) {
        setIsRunTaskAgain(true);
      }
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
  setIsRunTaskAgain: propTypes.func,
  setModalOpened: propTypes.func,
  slug: propTypes.string,
  title: propTypes.string,
  variant: propTypes.string,
};

export default ExecuteTaskButton;
