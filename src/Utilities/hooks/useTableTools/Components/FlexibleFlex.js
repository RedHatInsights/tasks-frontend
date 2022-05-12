import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import propTypes from 'prop-types';

const renderFlexItem = (content) => {
  console.log(content, 'content');
  let flexItem;
  content?.classname
    ? (flexItem = (
        <FlexItem className={content.classname}>{content.children}</FlexItem>
      ))
    : (flexItem = <FlexItem>{content}</FlexItem>);

  return flexItem;
};

const FlexibleFlex = ({ data, flexContents, flexProps }) =>
  flexContents.map((item) => {
    return (
      <Flex key={item.match} {...flexProps}>
        {Array.isArray(item.contents)
          ? item.contents.map((content) => renderFlexItem(content))
          : renderFlexItem(item.contents)}
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
