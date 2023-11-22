import React from 'react';
import { Button, Text, TextContent } from '@patternfly/react-core';
import {
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import {
  ACCESS_REDHAT_DOT_COM,
  HOST_COMMUNICATION_DOC_PATH,
  RHC_DOC,
  SATELLITE_DOC,
  YEAR,
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
      <OutlinedQuestionCircleIcon />
    </Button>
  );
};

export const TasksPagePopoverFooter = () => {
  return (
    <div>
      <a
        href={`${ACCESS_REDHAT_DOT_COM}${YEAR}${HOST_COMMUNICATION_DOC_PATH}${RHC_DOC}`}
      >
        <span>
          Using rhc with systems <ExternalLinkAltIcon />
        </span>
      </a>
      <br />
      <a
        href={`${ACCESS_REDHAT_DOT_COM}${YEAR}${HOST_COMMUNICATION_DOC_PATH}${SATELLITE_DOC}`}
      >
        <span>
          Configure Cloud Connector and Satellite <ExternalLinkAltIcon />
        </span>
      </a>
    </div>
  );
};
