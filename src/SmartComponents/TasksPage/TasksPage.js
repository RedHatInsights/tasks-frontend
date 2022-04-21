import React, { Suspense, lazy, useState } from 'react';

import { Spinner, StackItem, Stack } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { TasksTabs } from '../../PresentationalComponents';
import { TASKS_PAGE_TABS } from '../../constants';

const AvailableTasks = lazy(() => import('../AvailableTasks/AvailableTasks'));
const CompletedTasks = lazy(() => import('../CompletedTasks/CompletedTasks'));

import './tasks-page.scss';

const TasksPage = () => {
  const [tabIndex, setTab] = useState(0);

  const updateTab = (event, index) => {
    setTab(index);
  };

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Tasks" />
      </PageHeader>
      <TasksTabs
        className="tabs-background"
        tabIndex={tabIndex}
        updateTab={updateTab}
        tabsList={TASKS_PAGE_TABS}
      />
      <Main>
        <Stack hasGutter>
          <StackItem>
            <Suspense fallback={<Spinner />}>
              {tabIndex === 0 ? <AvailableTasks /> : <CompletedTasks />}
            </Suspense>
          </StackItem>
        </Stack>
      </Main>
    </React.Fragment>
  );
};

export default TasksPage;
