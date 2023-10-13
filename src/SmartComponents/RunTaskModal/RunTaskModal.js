import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Modal,
  TextInput,
  ValidatedOptions,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemTable from '../SystemTable/SystemTable';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  AVAILABLE_TASKS_ROOT,
  INFO_ALERT_SYSTEMS,
  TASKS_API_ROOT,
  TASK_ERROR,
} from '../../constants';
import { fetchSystems } from '../../../api';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import ExecuteTaskButton from '../../PresentationalComponents/ExecuteTaskButton/ExecuteTaskButton';
import ReactMarkdown from 'react-markdown';
import { dispatchNotification } from '../../Utilities/Dispatcher';
import { EXECUTE_TASK_NOTIFICATION } from '../../constants';
import { isError } from '../completedTaskDetailsHelpers';

const RunTaskModal = ({
  description,
  error,
  isOpen,
  name,
  selectedSystems,
  setIsRunTaskAgain,
  setModalOpened,
  slug,
  title,
}) => {
  const [selectedIds, setSelectedIds] = useState(selectedSystems);
  const [taskName, setTaskName] = useState();
  const [executeTaskResult, setExecuteTaskResult] = useState();
  const [createTaskError, setCreateTaskError] = useState({});
  const [filterSortString, setFilterSortString] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(selectedSystems);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIds(selectedSystems);
  }, [selectedSystems]);

  useEffect(() => {
    setTaskName(title);
  }, [title]);

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

  const bulkSelectIds = async (type, options) => {
    let newSelectedIds = [...selectedIds];

    switch (type) {
      case 'none': {
        setSelectedIds([]);
        break;
      }

      case 'page': {
        options.items.forEach((item) => {
          if (!newSelectedIds.includes(item.id)) {
            newSelectedIds.push(item.id);
          }
        });

        setSelectedIds(newSelectedIds);
        break;
      }

      case 'all': {
        let results = await fetchSystems(filterSortString);
        setSelectedIds(results.data.map(({ id }) => id));
        break;
      }
    }
  };

  const selectIds = (_event, _isSelected, _index, entity) => {
    let newSelectedIds = [...selectedIds];

    !newSelectedIds.includes(entity.id)
      ? newSelectedIds.push(entity.id)
      : newSelectedIds.splice(newSelectedIds.indexOf(entity.id), 1);

    setSelectedIds(newSelectedIds);
  };

  return (
    <Modal
      aria-label="run-task-modal"
      title={title || 'Error'}
      isOpen={isOpen}
      onClose={() => setModalOpened(false)}
      width={'70%'}
      actions={[
        <ExecuteTaskButton
          key="execute-task-button"
          ids={selectedIds}
          setExecuteTaskResult={setExecuteTaskResult}
          slug={slug}
          taskName={taskName}
          variant="primary"
        />,
        <Button
          key="cancel-execute-task-button"
          variant="link"
          onClick={() => cancelModal()}
        >
          Cancel
        </Button>,
      ]}
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
        <React.Fragment>
          <Flex>
            <FlexItem>
              <b>Task description</b>
            </FlexItem>
          </Flex>
          <Flex style={{ paddingBottom: '8px' }}>
            <FlexItem style={{ width: '100%' }}>
              <ReactMarkdown>{description}</ReactMarkdown>
            </FlexItem>
          </Flex>
          <Flex>
            <FlexItem>
              <a
                href={`${TASKS_API_ROOT}${AVAILABLE_TASKS_ROOT}/${slug}/playbook`}
              >
                Download preview of playbook
              </a>
            </FlexItem>
          </Flex>
          <br />
          <div>
            <Form>
              <FormGroup
                label="Task name"
                isRequired
                type="text"
                helperTextInvalid={
                  Object.prototype.hasOwnProperty.call(
                    createTaskError,
                    'statusText'
                  ) && createTaskError.statusText
                }
                fieldId="name"
                validated={
                  Object.prototype.hasOwnProperty.call(
                    createTaskError,
                    'status'
                  ) && 'error'
                }
              >
                <TextInput
                  value={taskName}
                  type="text"
                  onChange={setTaskName}
                  validated={
                    Object.prototype.hasOwnProperty.call(
                      createTaskError,
                      'status'
                    ) && ValidatedOptions.error
                  }
                  aria-label="task name"
                />
              </FormGroup>
            </Form>
          </div>
          <br />
          <div style={{ paddingBottom: '8px' }}>
            <b>Systems to run tasks on</b>
          </div>
          <Alert variant="info" isInline title={INFO_ALERT_SYSTEMS} />
          <SystemTable
            bulkSelectIds={bulkSelectIds}
            selectedIds={selectedIds}
            selectIds={selectIds}
            setFilterSortString={setFilterSortString}
          />
        </React.Fragment>
      )}
    </Modal>
  );
};

RunTaskModal.propTypes = {
  description: propTypes.any,
  error: propTypes.object,
  isOpen: propTypes.bool,
  name: propTypes.string,
  selectedSystems: propTypes.array,
  setIsRunTaskAgain: propTypes.func,
  setModalOpened: propTypes.func,
  slug: propTypes.string,
  title: propTypes.oneOfType([propTypes.string, propTypes.node]),
};

export default RunTaskModal;
