import React from 'react';
import { Icon, Tooltip } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';

export const createSystemLink = (id, name, keyData, isBetaEnv) => (
  <a
    rel="noreferrer"
    target="_blank"
    key={keyData}
    href={
      isBetaEnv
        ? `/preview/insights/inventory/${id}`
        : `/insights/inventory/${id}`
    }
  >
    {name}
  </a>
);

export const createEligibilityTooltip = (eligibility) => {
  return eligibility.tooltip ? (
    <Tooltip content={eligibility.tooltip}>
      <span>{eligibility.title}</span>
    </Tooltip>
  ) : (
    <span>{eligibility.title}</span>
  );
};

export const createConnectedIcon = (connected) => {
  return connected ? (
    <Tooltip content="RHC connection operational">
      <Icon status="success">
        <CheckCircleIcon />
      </Icon>
    </Tooltip>
  ) : (
    <Tooltip content="RHC connection failed.  Run 'rhc status' to check the RHC connection on this system and try running the task again">
      <Icon status="danger">
        <ExclamationCircleIcon />
      </Icon>
    </Tooltip>
  );
};
