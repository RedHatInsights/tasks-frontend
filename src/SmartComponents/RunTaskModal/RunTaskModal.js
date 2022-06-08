import React from 'react';
import { Flex, FlexItem, Modal } from '@patternfly/react-core';
import propTypes from 'prop-types';

const RunTaskModal = ({ task, isOpen, setModalOpened }) => {
  return (
    <Modal
      title={task.title}
      isOpen={isOpen}
      onClose={() => setModalOpened(false)}
      width={'70%'}
    >
      <React.Fragment>
        <Flex style={{ paddingBottom: '8px' }}>
          <FlexItem>
            <b>Task description</b>
          </FlexItem>
          <FlexItem>{task.description}</FlexItem>
        </Flex>
        <Flex>
          <FlexItem>
            <a href="#">Download preview of playbook</a>
          </FlexItem>
        </Flex>
        <br />
        <b>Systems to run tasks on</b>
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
