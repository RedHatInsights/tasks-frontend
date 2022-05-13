import React from 'react';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';

const RunTaskButton = ({ /*id, */ isFirst, variant }) => {
  return (
    <Button variant={variant}>{isFirst ? 'Run task' : 'Run task again'}</Button>
  );
};

RunTaskButton.propTypes = {
  id: propTypes.string,
  isFirst: propTypes.bool,
  variant: propTypes.string,
};

export default RunTaskButton;
