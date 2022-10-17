import React from 'react';
import propTypes from 'prop-types';
import { Label } from '@patternfly/react-core';

const EntryRowLabel = ({ color, icon, text }) => {
  return (
    <Label
      color={color}
      icon={icon}
      style={{ marginTop: '16px', marginBottom: '4px' }}
      className="pf-m-compact"
    >
      {text}
    </Label>
  );
};

EntryRowLabel.propTypes = {
  color: propTypes.string,
  icon: propTypes.any,
  text: propTypes.string,
};

export default EntryRowLabel;
