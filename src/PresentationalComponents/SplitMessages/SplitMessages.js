import React from 'react';
import { Icon, Split, SplitItem } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import Truncate from '@redhat-cloud-services/frontend-components/Truncate';
import propTypes from 'prop-types';

const SplitMessages = ({ alert, content }) => {
  return (
    <Split>
      {alert ? (
        <React.Fragment>
          <SplitItem style={{ paddingRight: '8px' }}>
            <Icon status="danger">
              <ExclamationCircleIcon />
            </Icon>
          </SplitItem>
          <SplitItem style={{ paddingRight: '16px' }}>
            <span style={{ color: '#C9190B' }}>Alert</span>
          </SplitItem>
        </React.Fragment>
      ) : null}
      <SplitItem color="#A30000">
        <Truncate text={content} length={150} inline />
      </SplitItem>
    </Split>
  );
};

SplitMessages.propTypes = {
  alert: propTypes.bool,
  content: propTypes.oneOfType([propTypes.string, propTypes.object]),
};

export default SplitMessages;
