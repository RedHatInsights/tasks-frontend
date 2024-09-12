import React, { useState } from 'react';
import propTypes from 'prop-types';
import { ExpandableSection } from '@patternfly/react-core';
import './ParameterDetails.scss';

const ParameterDetails = ({ parameters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onToggle = (_event, isExpanded) => {
    setIsExpanded(isExpanded);
  };

  return (
    parameters?.length > 0 && (
      <ExpandableSection
        isExpanded={isExpanded}
        onToggle={onToggle}
        toggleText={isExpanded ? 'Task parameters' : 'Show task parameters'}
        isIndented
      >
        <ul>
          {parameters.map((parameter, index) => (
            <li key={index}>
              {parameter.key}: <b>{parameter.value}</b>
            </li>
          ))}
        </ul>
      </ExpandableSection>
    )
  );
};

ParameterDetails.propTypes = {
  parameters: propTypes.array,
};

export default ParameterDetails;
