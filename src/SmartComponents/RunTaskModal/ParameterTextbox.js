import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
} from '@patternfly/react-core';

const ParameterTextbox = ({
  parameter,
  updateParameter,
  customDescription = undefined,
}) => {
  const [parameterText, setParameterText] = useState(
    parameter.default || parameter.value
  );
  const [validated, setValidated] = useState('default');
  const [helperText, setHelperText] = useState(
    customDescription || parameter.description
  );

  return (
    <FormGroup
      label={parameter.title || parameter.key}
      isRequired={parameter.required}
      fieldId="name"
    >
      <TextInput
        value={parameterText}
        type="text"
        aria-label={parameter.key}
        onChange={(_event, text) => {
          if (parameter.required) {
            if (text.trim().length) {
              setValidated('success');
              setHelperText(parameter.description);
              setParameterText(text);
              updateParameter(parameter, text);
            } else {
              setValidated('error');
              setHelperText('This parameter is required');
            }
          } else {
            setValidated('default');
            setParameterText(text);
            updateParameter(parameter, text);
          }
        }}
      />
      <FormHelperText>
        <HelperText>
          <HelperTextItem variant={validated}>{helperText}</HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

ParameterTextbox.propTypes = {
  parameter: propTypes.object.isRequired,
  updateParameter: propTypes.func.isRequired,
  customDescription: propTypes.string || propTypes.node,
};

export default ParameterTextbox;
