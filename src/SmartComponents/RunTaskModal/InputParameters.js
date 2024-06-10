import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

export const InputParameter = ({ parameter, setDefinedParameters }) => {
  const [paramValue, setParamValue] = useState(parameter.default);

  const updateParams = (value) => {
    setParamValue(value);
    setDefinedParameters((prevState) => {
      const newState = prevState.map((param) => {
        if (param.key === parameter.key) {
          return { key: param.key, value: value };
        } else {
          return param;
        }
      });
      return newState;
    });
  };

  return (
    <Form className="pf-v5-u-pb-lg">
      <FormGroup
        label={parameter.title || parameter.key}
        isRequired={parameter.required}
        type="text"
        fieldId="name"
      >
        <FormSelect
          value={paramValue}
          onChange={(_event, value) => updateParams(value)}
          aria-label={`Edit parameter ${parameter.key} value field`}
        >
          {parameter.values.map((value, index) => (
            <FormSelectOption key={index} value={value} label={value} />
          ))}
        </FormSelect>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{parameter.description}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </Form>
  );
};

InputParameter.propTypes = {
  parameter: propTypes.object,
  setDefinedParameters: propTypes.func,
};

const InputParameters = ({ parameters, setDefinedParameters }) => {
  return parameters.map((param) => {
    return (
      <InputParameter
        key={param.key}
        aria-label={param.key}
        parameter={param}
        setDefinedParameters={setDefinedParameters}
      />
    );
  });
};

InputParameters.propTypes = {
  parameters: propTypes.array,
  setDefinedParameters: propTypes.func,
};

export default InputParameters;
