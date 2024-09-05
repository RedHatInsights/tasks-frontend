import React from 'react';
import propTypes from 'prop-types';
import { Form, FormGroup } from '@patternfly/react-core';
import ParameterCheckbox from './ParameterCheckbox';
import ParameterDropdown from './ParameterDropdown';
import ParameterTextbox from './ParameterTextbox';
import { getInputParameterType } from '../../Utilities/helpers';

export const InputParameter = ({ parameter, updateParameter }) => {
  const type = getInputParameterType(parameter);
  const Component = {
    textbox: ParameterTextbox,
    checkbox: ParameterCheckbox,
    dropdown: ParameterDropdown,
  }[type];
  return (
    <FormGroup>
      <Component parameter={parameter} updateParameter={updateParameter} />
    </FormGroup>
  );
};

InputParameter.propTypes = {
  parameter: propTypes.object,
  updateParameter: propTypes.func,
};

const InputParameters = ({ parameters, setDefinedParameters }) => {
  const updateParameter = (parameter, newValue) => {
    setDefinedParameters((prevState) =>
      prevState.map((param) =>
        param.key === parameter.key
          ? { key: param.key, value: newValue }
          : param
      )
    );
  };
  return (
    <Form>
      {parameters.map((param) => {
        return (
          <InputParameter
            key={param.key}
            parameter={param}
            updateParameter={updateParameter}
          />
        );
      })}
    </Form>
  );
};

InputParameters.propTypes = {
  parameters: propTypes.array,
  setDefinedParameters: propTypes.func,
};

export default InputParameters;
