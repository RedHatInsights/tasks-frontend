import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Checkbox } from '@patternfly/react-core';
import { toBool } from '../../Utilities/helpers';

const ParameterCheckbox = ({
  parameter,
  updateParameters,
  customDescription = undefined,
}) => {
  const [parameterValue, setParameterValue] = useState(parameter.default);

  return (
    <Checkbox
      id={parameter.key}
      label={parameter.title}
      aria-label={parameter.key}
      description={customDescription || parameter.description}
      isChecked={toBool(parameterValue)}
      onChange={(_event, isChecked) => {
        let newParameterValue;
        if (['0', '1'].includes(parameterValue)) {
          newParameterValue = isChecked ? '1' : '0';
        } else {
          newParameterValue = isChecked ? 'True' : 'False';
        }
        setParameterValue(newParameterValue);
        updateParameters(parameter, newParameterValue);
      }}
    />
  );
};

ParameterCheckbox.propTypes = {
  parameter: propTypes.object.isRequired,
  updateParameters: propTypes.func.isRequired,
  customDescription: propTypes.string || propTypes.node,
};

export { ParameterCheckbox };
