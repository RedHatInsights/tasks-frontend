import React from 'react';
import { Card, CardBody, CardFooter, CardTitle } from '@patternfly/react-core';
import propTypes from 'prop-types';

export const CardBuilderContent = ({ content }) => {
  return content;
};

const findChild = (children, component) => {
  return children.find((child) => child.props.type === component);
};

const CardBuilder = ({ children, cardClass }) => {
  if (!Array.isArray(children)) {
    children = [children];
  }

  return (
    <Card className={cardClass}>
      <CardTitle className={findChild(children, 'title').props.className}>
        {findChild(children, 'title')}
      </CardTitle>
      <CardBody className={findChild(children, 'body').props.className}>
        {findChild(children, 'body')}
      </CardBody>
      <CardFooter className={findChild(children, 'footer').props.className}>
        {findChild(children, 'footer')}
      </CardFooter>
    </Card>
  );
};

CardBuilder.propTypes = {
  children: propTypes.any,
  cardClass: propTypes.string,
};

export default CardBuilder;
