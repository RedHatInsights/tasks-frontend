import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
} from '@patternfly/react-core';

export const InputParameter = ({ parameter, setDefinedParameters }) => {
  const [paramText, setParamText] = useState(
    parameter.default || parameter.value
  );
  const [validated, setValidated] = useState('default');
  const [helperText, setHelperText] = useState(parameter.description);

  const updateParams = (text) => {
    setParamText(text);
    setDefinedParameters((prevState) => {
      const newState = prevState.map((param) => {
        if (param.key === parameter.key) {
          let newDefinedParam = { key: param.key, value: text };
          if (parameter.required) {
            if (newDefinedParam.value.trim().length) {
              newDefinedParam.validated = true;
              setValidated('success');
              setHelperText(parameter.description);
            } else {
              newDefinedParam.validated = false;
              setValidated('error');
              setHelperText('This parameter is required');
            }
          }

          return newDefinedParam;
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
        label={parameter.key}
        isRequired={parameter.required}
        type="text"
        fieldId="name"
      >
        <TextInput
          value={paramText}
          type="text"
          onChange={(_event, text) => updateParams(text)}
          aria-label={`Edit parameter ${parameter.key} value field`}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem variant={validated}>{helperText}</HelperTextItem>
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
