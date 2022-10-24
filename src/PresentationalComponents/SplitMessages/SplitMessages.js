import React from 'react';
import { Split, SplitItem } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';

const SplitMessages = ({ content }) => {
  return (
    <Split>
      <SplitItem style={{ paddingRight: '8px' }}>
        <ExclamationCircleIcon color="#C9190B" />
      </SplitItem>
      <SplitItem style={{ paddingRight: '16px' }}>
        <span style={{ color: '#C9190B' }}>Alert</span>
      </SplitItem>
      <SplitItem color="#A30000">{content}</SplitItem>
    </Split>
  );
};

SplitMessages.propTypes = {
  content: propTypes.string,
};

export default SplitMessages;
