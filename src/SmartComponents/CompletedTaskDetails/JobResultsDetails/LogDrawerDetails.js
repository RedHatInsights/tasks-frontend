import React from 'react';
import propTypes from 'prop-types';
import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer';
import {
  Icon,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
} from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm';

const LogDrawerDetails = ({ jobName, logs }) => {
  function downloadFile(
    data,
    filename = `${new Date().toISOString()}`,
    format = 'txt'
  ) {
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `${filename}.${format}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openInNewTab(data) {
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank');
  }

  const onDownloadLogClick = () => {
    downloadFile(logs, `${jobName}-${new Date().toISOString()}`);
  };

  return (
    <LogViewer
      data={logs}
      toolbar={
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <LogViewerSearch
                style={{ minWidth: '300px' }}
                placeholder="Search"
              />
            </ToolbarItem>
            <ToolbarItem style={{ marginRight: '0px' }}>
              <Button variant="plain" onClick={onDownloadLogClick}>
                <Icon>
                  <ExportIcon />
                </Icon>
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant="link"
                onClick={() =>
                  openInNewTab(logs, `${jobName}-${new Date().toISOString()}`)
                }
              >
                Open log in new tab{' '}
                {
                  <Icon>
                    <ExternalLinkAltIcon />
                  </Icon>
                }
              </Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      }
    />
  );
};

LogDrawerDetails.propTypes = {
  jobName: propTypes.string,
  logs: propTypes.string,
};

export default LogDrawerDetails;
