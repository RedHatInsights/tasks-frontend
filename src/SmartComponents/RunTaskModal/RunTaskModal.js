import React, { useEffect, useState } from 'react';
import { Button, Flex, FlexItem, Modal } from '@patternfly/react-core';
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

const RunTaskModal = ({
  description,
  error,
  isOpen,
  selectedSystems,
  setModalOpened,
  slug,
  title,
}) => {
  const [selectedIds, setSelectedIds] = useState(selectedSystems);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(selectedSystems);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIds([]);
  }, [slug]);

  const cancelModal = () => {
    setSelectedIds([]);
    setModalOpened(false);
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
          setModalOpened={setModalOpened}
          slug={slug}
          title={title}
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
            <FlexItem>{description}</FlexItem>
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
          <b>Systems to run tasks on</b>
          <SystemTable selectedIds={selectedIds} selectIds={selectIds} />
        </React.Fragment>
      )}
    </Modal>
  );
};

RunTaskModal.propTypes = {
  description: propTypes.string,
  error: propTypes.object,
  isOpen: propTypes.bool,
  selectedSystems: propTypes.array,
  setModalOpened: propTypes.func,
  slug: propTypes.string,
  title: propTypes.string,
};

export default RunTaskModal;
