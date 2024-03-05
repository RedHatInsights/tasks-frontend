import React, { useEffect, useRef, useState } from 'react';
import propTypes from 'prop-types';
import {
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { getLogs } from '../../../../api';
import LogDrawerDetails from './LogDrawerDetails';

const JobLogDrawer = ({
  children,
  isLogDrawerExpanded,
  jobName,
  jobId,
  setIsLogDrawerExpanded,
}) => {
  const [stdout, setStdOut] = useState();
  useEffect(() => {
    const fetchlogs = async () => {
      setStdOut(await getLogs(jobId));
    };

    if (isLogDrawerExpanded) {
      fetchlogs();
    }
  }, [isLogDrawerExpanded]);

  const drawerRef = useRef();
  const onExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  const onCloseClick = () => {
    setIsLogDrawerExpanded(false);
  };

  const panelContent = (
    <DrawerPanelContent
      isResizable
      id="end-resize-panel"
      defaultSize="1000px"
      minSize="500px"
    >
      <DrawerHead>
        <TextContent>
          <Text component={TextVariants.h1}>
            <span tabIndex={isLogDrawerExpanded ? 0 : -1} ref={drawerRef}>
              {`Log for: ${jobName || 'System deleted'}`}
            </span>
          </Text>
        </TextContent>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseClick} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        <LogDrawerDetails logs={stdout} jobName={jobName} />
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  return (
    <Drawer isExpanded={isLogDrawerExpanded} onExpand={onExpand} position="end">
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>{children}</DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

JobLogDrawer.propTypes = {
  children: propTypes.node,
  isLogDrawerExpanded: propTypes.bool,
  jobName: propTypes.string,
  jobId: propTypes.string,
  setIsLogDrawerExpanded: propTypes.func,
};

export default JobLogDrawer;
