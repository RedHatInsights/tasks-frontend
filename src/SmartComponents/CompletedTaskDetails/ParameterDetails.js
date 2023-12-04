import React from 'react';
import propTypes from 'prop-types';
import {
  Flex,
  FlexItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

const ParameterDetails = ({ parameters }) => {
  return (
    parameters && (
      <Flex>
        <FlexItem>
          <TextContent>
            <Text component={TextVariants.h4}>Parameter details</Text>
            {parameters.map((parameter) => (
              <Text
                key={`parameter-${parameter.key}`}
                component={TextVariants.p}
                className="pf-u-mb-sm"
              >
                {parameter.key}: <b>{parameter.value}</b>
              </Text>
            ))}
          </TextContent>
        </FlexItem>
      </Flex>
    )
  );
};

ParameterDetails.propTypes = {
  parameters: propTypes.array,
};

export default ParameterDetails;
