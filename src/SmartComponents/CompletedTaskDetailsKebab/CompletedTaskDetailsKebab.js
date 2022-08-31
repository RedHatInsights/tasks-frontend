import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';

const CompletedTaskDetailsKebab = ({ status, setModalOpened }) => {
  const [isOpen, setIsOpen] = useState(false);
  const createDropdownItems = () => {
    //let type = status === 'Running' ? 'cancel' : 'delete';
    let type = 'delete';
    return [
      <DropdownItem
        aria-label={`${type}-task-kebab-button`}
        key={`${type}-task`}
        component="button"
        data-ouia-component-id={`${type}-task-dropdown-item`}
        onClick={() => setModalOpened(true)}
        isDisabled={status !== 'Completed'}
      >
        {type[0].toUpperCase() + type.slice(1)}
      </DropdownItem>,
    ];
  };

  const [dropdownItems, setDropdownItems] = useState(createDropdownItems());

  useEffect(() => {
    if (status !== undefined) {
      setDropdownItems(createDropdownItems());
    }
  }, [status]);

  return (
    <Dropdown
      onSelect={() => setIsOpen(false)}
      position={DropdownPosition.right}
      toggle={
        <KebabToggle
          onToggle={() => setIsOpen(!isOpen)}
          id="executed-task-kebab"
        />
      }
      isOpen={isOpen}
      isPlain
      dropdownItems={dropdownItems}
    />
  );
};

CompletedTaskDetailsKebab.propTypes = {
  setModalOpened: propTypes.func,
  status: propTypes.string,
};

export default CompletedTaskDetailsKebab;
