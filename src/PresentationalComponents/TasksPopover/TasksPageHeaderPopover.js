import React from 'react';
import { Button, Icon, Text, TextContent } from '@patternfly/react-core';
import {
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import {
  INSIGHTS_DOCUMENTATION,
  DOC_VERSION,
  HOST_COMMUNICATION_DOC_PATH,
  RHC_DOC,
  SATELLITE_DOC,
} from '../../constants';

export const TasksPagePopoverHeader = () => {
  return <div>About tasks</div>;
};

export const TasksPagePopoverBody = () => {
  return (
    <TextContent>
      <Text>
        Tasks allows you to run resource-intensive additional troubleshooting on
        your connected systems. Ansible Playbooks are written by Red Hat to do
        the selected tasks.
        <br /> <br />
        Eligible systems include systems connected to console.redhat.com with
        rhc, or Satellite with Cloud Connector.
      </Text>
    </TextContent>
  );
};

export const TasksPagePopoverIcon = () => {
  return (
    <Button
      variant="plain"
      aria-label="About Tasks"
      className="pf-u-pl-sm pf-u-pr-0"
    >
      <Icon>
        <OutlinedQuestionCircleIcon />
      </Icon>
    </Button>
  );
};

export const TasksPagePopoverFooter = () => {
  return (
    <div>
      <a
        href={`${INSIGHTS_DOCUMENTATION}${DOC_VERSION}${HOST_COMMUNICATION_DOC_PATH}${RHC_DOC}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          Using rhc with systems{' '}
          <Icon>
            <ExternalLinkAltIcon />
          </Icon>
        </span>
      </a>
      <br />
      <a
        href={`${INSIGHTS_DOCUMENTATION}${DOC_VERSION}${HOST_COMMUNICATION_DOC_PATH}${SATELLITE_DOC}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          Configure Cloud Connector and Satellite{' '}
          <Icon>
            <ExternalLinkAltIcon />
          </Icon>
        </span>
      </a>
    </div>
  );
};
