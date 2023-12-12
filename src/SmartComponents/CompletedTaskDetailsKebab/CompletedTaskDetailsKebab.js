import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from '@patternfly/react-core/';
import { EllipsisVIcon } from '@patternfly/react-icons';

const CompletedTaskDetailsKebabItems = ({ status, setModalOpened }) => {
  //let type = status === 'Running' ? 'cancel' : 'delete';
  let type = 'delete';

  return (
    <DropdownItem
      aria-label={`${type}-task-kebab-button`}
      key={`${type}-task`}
      component="button"
      data-ouia-component-id={`${type}-task-dropdown-item`}
      onClick={() => setModalOpened(true)}
      isDisabled={status !== 'Completed'}
    >
      {type[0].toUpperCase() + type.slice(1)}
    </DropdownItem>
  );
};

CompletedTaskDetailsKebabItems.propTypes = {
  setModalOpened: propTypes.func,
  status: propTypes.string,
};

const CompletedTaskDetailsKebab = ({ status, setModalOpened }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      onSelect={() => setIsOpen(false)}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          id="executed-task-kebab"
          aria-label="kebab dropdown toggle"
          variant="plain"
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      isOpen={isOpen}
      shouldFocusToggleOnSelect
      popperProps={{ position: 'right' }}
    >
      <DropdownList>
        <CompletedTaskDetailsKebabItems
          status={status}
          setModalOpened={setModalOpened}
        />
      </DropdownList>
    </Dropdown>
  );
};

CompletedTaskDetailsKebab.propTypes = {
  setModalOpened: propTypes.func,
  status: propTypes.string,
};

export default CompletedTaskDetailsKebab;
