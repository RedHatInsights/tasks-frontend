import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import propTypes from 'prop-types';

const renderFlexItem = (content, key, idx) => {
  let keyString = idx !== undefined ? `${key}-${idx}` : `${key}`;
  return (
    <FlexItem key={content.key || `${keyString}`} className={content.classname}>
      {content.children || content}
    </FlexItem>
  );
};

const FlexibleFlex = ({ data, flexContents, flexProps }) => {
  return flexContents.map((item, idx) => {
    return (
      <Flex key={item.key} {...flexProps}>
        {Array.isArray(item.children)
          ? item.children.map((content) => renderFlexItem(content))
          : renderFlexItem(item.children, item.key)}
        {item.match
          ? item.renderFunc
            ? renderFlexItem(
                item.renderFunc(item.match.map((prop) => data[prop]))
              )
            : renderFlexItem(data[item.match], item.key, idx)
          : null}
      </Flex>
    );
  });
};

FlexibleFlex.propTypes = {
  data: propTypes.any,
  flexContents: propTypes.array,
  flexProps: propTypes.object,
};

export default FlexibleFlex;
