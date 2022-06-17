import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import propTypes from 'prop-types';

const renderFlexItem = (content) => {
  return (
    <FlexItem className={content.classname}>
      {content.children || content}
    </FlexItem>
  );
};

const FlexibleFlex = ({ data, flexContents, flexProps }) => {
  return flexContents.map((item) => {
    return (
      <Flex key={item.match} {...flexProps}>
        {Array.isArray(item.children)
          ? item.children.map((content) => renderFlexItem(content))
          : renderFlexItem(item.children)}
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
};

FlexibleFlex.propTypes = {
  data: propTypes.object,
  flexContents: propTypes.array,
  flexProps: propTypes.object,
};

export default FlexibleFlex;
