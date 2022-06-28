import React, { useEffect, useState } from 'react';
import { Flex, FlexItem, Modal } from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemTable from '../SystemTable/SystemTable';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  AVAILABLE_TASKS_ROOT,
  TASKS_API_ROOT,
  TASK_ERROR,
} from '../../constants';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import ExecuteTaskButton from '../../PresentationalComponents/ExecuteTaskButton/ExecuteTaskButton';

const RunTaskModal = ({ error, task, isOpen, setModalOpened }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setSelectedIds([]);
  }, [task]);

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
      title={task.title || 'Error'}
      isOpen={isOpen}
      onClose={() => setModalOpened(false)}
      width={'70%'}
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
            <FlexItem>{task.description}</FlexItem>
          </Flex>
          <Flex>
            <FlexItem>
              <a
                href={`${TASKS_API_ROOT}${AVAILABLE_TASKS_ROOT}/${task.slug}/playbook`}
              >
                Download preview of playbook
              </a>
            </FlexItem>
          </Flex>
          <br />
          <b>Systems to run tasks on</b>
          <SystemTable selectedIds={selectedIds} selectIds={selectIds} />
          <ExecuteTaskButton
            ids={selectedIds}
            setModalOpened={setModalOpened}
            slug={task.slug}
            title={task.title}
            variant="primary"
          />
        </React.Fragment>
      )}
    </Modal>
  );
};

RunTaskModal.propTypes = {
  error: propTypes.object,
  isOpen: propTypes.bool,
  setModalOpened: propTypes.func,
  task: propTypes.object,
};

export default RunTaskModal;
