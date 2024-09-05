import {
  Checkbox,
  FormGroup,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import React, { useState } from 'react';
import propTypes from 'prop-types';

const ParameterCheckboxGroup = ({
  parameter,
  updateParameter,
  customDescription = undefined,
}) => {
  const [parameterValue, setParameterValue] = useState(
    ['None', ''].includes(parameter.default) ? [] : parameter.default.split(',')
  );

  return (
    <FormGroup role="group" fieldId={parameter.key}>
      <TextContent>
        <Text component={TextVariants.h4}>{parameter.title}</Text>
        <Text component={TextVariants.p}>
          {customDescription || parameter.description}
        </Text>
      </TextContent>
      <div style={{ paddingTop: '0.5rem', paddingLeft: '1rem' }}>
        {parameter.values
          .filter((val) => !['None', ''].includes(val)) // remove vals that indicate nothing was selected
          .map((val) => (
            <Checkbox
              id={val}
              key={val}
              label={val}
              aria-label={`${parameter.key}.${val}`}
              isChecked={parameterValue.includes(val)}
              onChange={(_event, isChecked) => {
                const newParameterValue = isChecked
                  ? [...parameterValue, val]
                  : parameterValue.filter((pv) => pv !== val);
                setParameterValue(newParameterValue);
                updateParameter(
                  parameter,
                  newParameterValue.join(',') || 'None'
                );
              }}
            />
          ))}
      </div>
    </FormGroup>
  );
};

ParameterCheckboxGroup.propTypes = {
  parameter: propTypes.object.isRequired,
  updateParameter: propTypes.func.isRequired,
  customDescription: propTypes.string || propTypes.node,
};

export default ParameterCheckboxGroup;
