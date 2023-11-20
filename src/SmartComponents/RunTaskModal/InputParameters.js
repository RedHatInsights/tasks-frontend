import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Form,
  FormGroup,
} from '@patternfly/react-core/dist/js/components/Form';
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput';
import { ValidatedOptions } from '@patternfly/react-core/dist/js/helpers/constants';

export const InputParameter = ({ parameter, setDefinedParameters }) => {
  const [paramText, setParamText] = useState(
    parameter.default || parameter.value
  );

  const updateParams = (text) => {
    setParamText(text);
    setDefinedParameters((prevState) => {
      const newState = prevState.map((param) => {
        if (param.key === parameter.key) {
          let newDefinedParam = { key: param.key, value: text };
          if (parameter.required) {
            newDefinedParam.validated = newDefinedParam.value.length
              ? true
              : false;
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
    <Form className="pf-u-pb-lg">
      <FormGroup
        label={parameter.key}
        isRequired={parameter.required}
        type="text"
        helperText={parameter.description}
        helperTextInvalid={
          parameter.required ? 'This parameter is required' : null
        }
        fieldId="name"
        validated={
          parameter.required && paramText === '' ? ValidatedOptions.error : null
        }
      >
        <TextInput
          value={paramText}
          type="text"
          onChange={updateParams}
          validated={
            parameter.required && paramText === ''
              ? ValidatedOptions.error
              : null
          }
          aria-label={`${parameter.key}-input`}
        />
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
