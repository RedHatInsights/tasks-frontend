import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

const TasksTabs = ({ className, tabIndex, tabsList, updateTab }) => {
  return (
    <Tabs className={className} activeKey={tabIndex} onSelect={updateTab}>
      {tabsList.map((tabName, index) => (
        <Tab
          id={`tabs-page-${index}`}
          key={`tabs-page-${index}`}
          eventKey={index}
          title={<TabTitleText>{tabName}</TabTitleText>}
        />
      ))}
    </Tabs>
  );
};

TasksTabs.propTypes = {
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  tabsList: PropTypes.array,
  updateTab: PropTypes.func,
};

export default TasksTabs;
