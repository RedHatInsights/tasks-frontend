import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import propTypes from 'prop-types';

const renderFlexItem = (display) => {
  return <FlexItem>{display}</FlexItem>;
};

const FlexibleFlex = ({ data, flexContents, flexProps }) =>
  flexContents.map((item) => {
    return (
      <Flex key={item.match} {...flexProps}>
        {renderFlexItem(item.contents)}
        {item.match
          ? item.renderFunc
            ? renderFlexItem(
                item.renderFunc(item.match.map((prop) => data[prop]))
              )
            : renderFlexItem(data[item.match])
          : null}
      </Flex>
    );
  });

FlexibleFlex.propTypes = {
  data: propTypes.object,
  flexContents: propTypes.array,
  flexProps: propTypes.object,
};

export default FlexibleFlex;
