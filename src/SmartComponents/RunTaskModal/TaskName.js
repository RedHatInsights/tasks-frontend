import {
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const TaskName = ({ taskName, setTaskName, createTaskError }) => {
  const [validated, setValidated] = useState('default');
  const [helperText, setHelperText] = useState(null);

  const handleSetTaskName = (_event, name) => {
    setTaskName(name);
  };

  useEffect(() => {
    if (createTaskError.status) {
      setHelperText(createTaskError.statusText);
      setValidated('error');
    }
  }, [createTaskError]);

  useEffect(() => {
    if (taskName.trim().length === 0) {
      setHelperText('Task name cannot be empty');
      setValidated('error');
    } else if (validated === 'error') {
      setValidated('default');
      setHelperText(null);
    }
  }, [taskName]);

  return (
    <Form>
      <FormGroup label="Task name" isRequired type="text" fieldId="name">
        <TextInput
          value={taskName}
          type="text"
          onChange={handleSetTaskName}
          aria-label="Edit task name text field"
          validated={validated}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem
              variant={validated}
              {...(validated === 'error' && {
                icon: <ExclamationCircleIcon />,
              })}
            >
              {helperText}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </Form>
  );
};

TaskName.propTypes = {
  createTaskError: propTypes.shape({
    status: propTypes.any,
    statusText: propTypes.string,
  }),
  taskName: propTypes.string,
  setTaskName: propTypes.func,
};

export { TaskName };
