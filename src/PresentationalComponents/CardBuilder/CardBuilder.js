import React from 'react';
import { Card, CardBody, CardFooter, CardTitle } from '@patternfly/react-core';
import propTypes from 'prop-types';

const renderContentType = (data, item, actionFuncs) => {
  let returnedContent;
  let actionFunc = actionFuncs?.find((func) => {
    if (item.actionFunc === Object.keys(func)[0]) {
      return func[item.actionFunc];
    }
  });

  typeof item.content === 'function'
    ? (returnedContent = item.content(
        item.match === 'all' ? data : data[item.match],
        actionFunc?.[item.actionFunc]
      ))
    : (returnedContent = data[item.match]);

  return returnedContent;
};

const renderContent = (data, content, actionFuncs) => {
  return content.map((item, index) => {
    return (
      <div key={`${item.match}-${index}`} className={item.classname}>
        {renderContentType(data, item, actionFuncs)}
      </div>
    );
  });
};

const CardBuilder = ({
  actionFuncs,
  data,
  cardClass,
  cardHeader,
  cardBody,
  cardFooter,
}) => {
  return (
    <Card className={cardClass}>
      <CardTitle className={cardHeader.classname}>
        {renderContent(data, cardHeader.contents)}
      </CardTitle>
      <CardBody className={cardBody.classname}>
        {renderContent(data, cardBody.contents)}
      </CardBody>
      <CardFooter className={cardFooter.classname}>
        {renderContent(data, cardFooter.contents, actionFuncs)}
      </CardFooter>
    </Card>
  );
};

CardBuilder.propTypes = {
  actionFuncs: propTypes.array,
  data: propTypes.object,
  cardClass: propTypes.string,
  cardHeader: propTypes.object,
  cardBody: propTypes.object,
  cardFooter: propTypes.object,
};

export default CardBuilder;
