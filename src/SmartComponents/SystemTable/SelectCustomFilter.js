import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import { findFilterData } from './helpers';

const SelectCustomFilter = ({
  filterId,
  options,
  selectedValue,
  setFilterData,
}) => {
  const [isOpen, setOpen] = useState(false);

  const handleSelectChange = (value) => {
    setFilterData(findFilterData(value, options));
    setOpen(false);
  };

  const toggle = (toggleRef) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setOpen(!isOpen)}
      isExpanded={isOpen}
      style={{
        width: 'auto',
      }}
    >
      {options.find((item) => item.value === selectedValue)?.label}
    </MenuToggle>
  );

  return (
    <div
      className="pf-v5-c-select pf-v5-u-mr-sm pf-v5-u-mb-sm"
      style={{ width: 'auto' }}
    >
      <Select
        aria-label="Select Input"
        isOpen={isOpen}
        key={filterId}
        onSelect={(event, optionName) => handleSelectChange(optionName)}
        onOpenChange={(isOpen) => setOpen(isOpen)}
        selected={options.find((item) => item.value === selectedValue)?.label}
        toggle={toggle}
        shouldFocusToggleOnSelect
      >
        <SelectList>
          {options.map((item) => (
            <SelectOption
              width="100%"
              key={filterId + item.label}
              value={item.label}
            >
              {item.label}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </div>
  );
};

SelectCustomFilter.propTypes = {
  filterId: propTypes.string,
  options: propTypes.array,
  setFilterData: propTypes.func,
  selectedValue: propTypes.object,
};

export default SelectCustomFilter;
