import React, { useEffect, useState } from 'react';
import { Flex, FlexItem, Modal } from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemTable from '../SystemTable/SystemTable';
import { useDispatch } from 'react-redux';

const RunTaskModal = ({ task, isOpen, setModalOpened }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedIds([]);
  }, [task]);

  useEffect(() => {
    dispatch({
      type: 'SELECT_ENTITY',
      payload: {
        selected: selectedIds,
      },
    });
  }, [selectedIds]);

  const selectIds = (_event, _isSelected, _index, entity) => {
    let newSelectedIds = [...selectedIds];

    !newSelectedIds.includes(entity.id)
      ? newSelectedIds.push(entity.id)
      : newSelectedIds.splice(newSelectedIds.indexOf(entity.id), 1);

    setSelectedIds(newSelectedIds);
  };

  return (
    <Modal
      title={task.title}
      isOpen={isOpen}
      onClose={() => setModalOpened(false)}
      width={'70%'}
    >
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
            <a href="#">Download preview of playbook</a>
          </FlexItem>
        </Flex>
        <br />
        <b>Systems to run tasks on</b>
        <SystemTable selectedIds={selectedIds} selectIds={selectIds} />
      </React.Fragment>
    </Modal>
  );
};

RunTaskModal.propTypes = {
  isOpen: propTypes.bool,
  setModalOpened: propTypes.func,
  task: propTypes.object,
};

export default RunTaskModal;
