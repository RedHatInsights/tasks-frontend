import React from 'react';
import { Flex, Icon, Popover, Title } from '@patternfly/react-core';
import {
  BanIcon,
  ConnectedIcon,
  DisconnectedIcon,
} from '@patternfly/react-icons';

const boldText = 'pf-v5-u-font-weight-bold';

export const createSystemLink = (id, name, keyData) => (
  <a
    rel="noreferrer"
    target="_blank"
    key={keyData}
    href={`/insights/inventory/${id}`}
  >
    {name}
  </a>
);

export const createLink = (href, text) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
);

export const populateEligibilityColumn = (eligibility) => {
  return eligibility.tooltip ? (
    <Popover
      distance={10}
      position="right"
      triggerAction="hover"
      headerContent={
        <Title headingLevel="h4">
          <Icon size="md">
            <BanIcon />
          </Icon>
          <span style={{ marginLeft: '0.5rem' }}>
            System is not eligible to run this task
          </span>
        </Title>
      }
      bodyContent={
        <ul>
          {eligibility.tooltip.split('. ').map((text, index) => (
            <li key={index} style={{ listStyle: 'disc inside' }}>
              {text}
            </li>
          ))}
        </ul>
      }
    >
      <Flex>
        <p style={{ borderBottomStyle: 'dotted', maxWidth: 'fit-content' }}>
          {eligibility.title}
        </p>
      </Flex>
    </Popover>
  ) : (
    <Flex>
      <p style={{ maxWidth: 'fit-content' }}>
        <span>{eligibility.title}</span>
      </p>
    </Flex>
  );
};

export const populateConnectedColumn = (connected) => {
  return connected ? (
    <div>
      <Icon size="sm">
        <ConnectedIcon />
      </Icon>
      <span style={{ marginLeft: '0.5rem' }}>Connected</span>
    </div>
  ) : (
    <Popover
      triggerAction="hover"
      headerContent={
        <Title headingLevel="h4">
          <Icon size="md">
            <DisconnectedIcon />
          </Icon>
          <span style={{ marginLeft: '0.5rem' }}>
            System is not connected via RHC
          </span>
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
      <div>
        <Icon size="sm">
          <DisconnectedIcon />
        </Icon>
        <span style={{ borderBottomStyle: 'dotted', marginLeft: '0.5rem' }}>
          Not connected
        </span>
      </div>
    </Popover>
  );
};
