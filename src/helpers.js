import React from 'react';
import { Flex, Popover, Title, Tooltip } from '@patternfly/react-core';
import { ConnectedIcon, DisconnectedIcon } from '@patternfly/react-icons';

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
  const xsIcon = 'pf-u-mr-xs';
  const boldText = 'pf-v5-u-font-weight-bold';
  return connected ? (
    <span>
      <ConnectedIcon className={xsIcon} /> Connected
    </span>
  ) : (
    <Popover
      triggerAction="hover"
      headerContent={
        <Title headingLevel="h4">
          <DisconnectedIcon className={xsIcon} /> System is not connected via
          RHC
        </Title>
      }
      position="right"
      bodyContent={
        <Flex
          direction={{ default: 'column' }}
          spaceItems={{ default: 'spaceItemsNone' }}
        >
          <p>
            Run <span className={boldText}>rhc status</span> to check if this
            system has an RHC connection to Red Hat Insights. After verifying
            the connection is active, click the{' '}
            <span className={boldText}>Select systems</span> button again.
          </p>
          <a
            target="_blank"
            href="https://docs.redhat.com/en/documentation/red_hat_insights/1-latest/html/red_hat_insights_remediations_guide/host-communication-with-insights_red-hat-insights-remediation-guide"
            style={{ textDecoration: 'underline' }}
            rel="noreferrer"
          >
            Please review the RHC documentation
          </a>
        </Flex>
      }
    >
      <Flex>
        <DisconnectedIcon className="pf-u-mr-xs" />
        <p style={{ borderBottomStyle: 'dotted', maxWidth: 'fit-content' }}>
          Not connected
        </p>
      </Flex>
    </Popover>
  );
};
