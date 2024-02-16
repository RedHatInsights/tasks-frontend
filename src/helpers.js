import React from 'react';
import { Tooltip } from '@patternfly/react-core';

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
