import {
  FormGroup,
  FormHelperText,
  FormSelect,
  FormSelectOption,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import React, { useState } from 'react';
import propTypes from 'prop-types';

const ParameterDropdown = ({
  parameter,
  updateParameter,
  customDescription = undefined,
}) => {
  const [parameterValue, setParameterValue] = useState(parameter.default);

  return (
    <FormGroup
      label={parameter.title || parameter.key}
      isRequired={parameter.required}
      type="text"
      fieldId="name"
    >
      <FormSelect
        value={parameterValue}
        onChange={(_event, value) => {
          setParameterValue(value);
          updateParameter(parameter, value);
        }}
        aria-label={parameter.key}
      >
        {parameter.values.map((value, index) => (
          <FormSelectOption key={index} value={value} label={value} />
        ))}
      </FormSelect>
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

ParameterDropdown.propTypes = {
  parameter: propTypes.object.isRequired,
  updateParameter: propTypes.func.isRequired,
  customDescription: propTypes.string || propTypes.node,
};

export default ParameterDropdown;
