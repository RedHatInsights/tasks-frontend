import React from 'react';
import { Button, Icon, Content } from '@patternfly/react-core';
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
    <Content>
      <Content component="p">
        Tasks allows you to run resource-intensive additional troubleshooting on
        your connected systems. Ansible Playbooks are written by Red Hat to do
        the selected tasks.
        <br /> <br />
        Eligible systems include systems connected to console.redhat.com with
        rhc, or Satellite with Cloud Connector.
      </Content>
    </Content>
  );
};

export const TasksPagePopoverIcon = () => {
  return (
    <Button
      icon={
        <Icon>
          <OutlinedQuestionCircleIcon />
        </Icon>
      }
      variant="plain"
      aria-label="About Tasks"
      className="pf-v6-u-p-0"
    />
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
