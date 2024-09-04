import React, { useState } from 'react';
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  Badge,
  HelperText,
  HelperTextItem,
  FormGroup,
  FormHelperText,
} from '@patternfly/react-core';
import propTypes from 'prop-types';

const ParameterMultiSelect = ({
  parameter,
  updateParameter,
  customDescription,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [parameterValue, setParameterValue] = useState([]);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event, value) => {
    const newParameterValue = parameterValue.includes(value)
      ? parameterValue.filter((val) => val !== value)
      : [...parameterValue, value];
    setParameterValue(newParameterValue);
    updateParameter(parameter, newParameterValue.join(',') || 'None');
  };

  const toggle = (toggleRef) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      badge={
        parameterValue.length > 0 && <Badge>{parameterValue.length}</Badge>
      }
    >
      Select {parameter.title || parameter.key}
    </MenuToggle>
  );

  return (
    <FormGroup
      label={parameter.title || parameter.key}
      isRequired={parameter.required}
      fieldId={parameter.key}
    >
      <Select
        role="menu"
        id={parameter.key}
        aria-label={parameter.key}
        isOpen={isOpen}
        selected={parameterValue}
        onSelect={onSelect}
        onOpenChange={(nextOpen) => setIsOpen(nextOpen)}
        toggle={toggle}
      >
        <SelectList>
          {parameter.values
            .filter((value) => value !== 'None')
            .map((value, index) => (
              <SelectOption
                key={index}
                value={value}
                hasCheckbox
                isSelected={parameterValue.includes(value)}
              >
                {value}
              </SelectOption>
            ))}
        </SelectList>
      </Select>
      <FormHelperText>
        <HelperText>
          <HelperTextItem>
            {customDescription || parameter.description}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

ParameterMultiSelect.propTypes = {
  parameter: propTypes.object.isRequired,
  updateParameter: propTypes.func.isRequired,
  customDescription: propTypes.string || propTypes.node,
};

export default ParameterMultiSelect;
