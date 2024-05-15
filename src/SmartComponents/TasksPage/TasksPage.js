import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { StackItem, Stack } from '@patternfly/react-core';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { TasksTabs } from '../../PresentationalComponents';
import {
  TASKS_PAGE_HEADER,
  TASKS_PAGE_HEADER_FLEX_PROPS,
  TASKS_PAGE_TABS,
} from '../../constants';
import FlexibleFlex from '../../PresentationalComponents/FlexibleFlex/FlexibleFlex';
import AvailableTasks from '../AvailableTasks/AvailableTasks';
import ActivityTable from '../../SmartComponents/ActivityTable/ActivityTable';
import { useNavigate, Outlet } from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import './tasks-page.scss';

const TasksPage = ({ tab }) => {
  const [tabIndex, setTab] = useState(tab);
  const chrome = useChrome();

  useEffect(() => {
    setTab(tab);
  }, [tab]);

  const navigate = useNavigate();
  const updateTab = (event, index) => {
    navigate(index ? '../executed' : '../available');
  };

  const openTaskModal = (value, slug) => {
    navigate(`./${slug}`); // task modal is declared in Routes.js
  };

  useEffect(() => {
    chrome.updateDocumentTitle('Tasks - Automation');
  }, [chrome]);

  return (
    <React.Fragment>
      <PageHeader>
        <FlexibleFlex
          flexContents={TASKS_PAGE_HEADER}
          flexProps={TASKS_PAGE_HEADER_FLEX_PROPS}
        />
      </PageHeader>
      <TasksTabs
        className="tabs-background"
        tabIndex={tabIndex}
        updateTab={updateTab}
        tabsList={TASKS_PAGE_TABS}
      />
      <section className="pf-v5-l-page__main-section pf-v5-c-page__main-section">
        <Stack hasGutter>
          <StackItem>
            {tabIndex === 0 ? (
              <AvailableTasks openTaskModal={openTaskModal} />
            ) : (
              <ActivityTable openTaskModal={openTaskModal} />
            )}
          </StackItem>
        </Stack>
      </section>
      <Outlet />
    </React.Fragment>
  );
};

TasksPage.propTypes = {
  tab: propTypes.number,
};

export default TasksPage;
