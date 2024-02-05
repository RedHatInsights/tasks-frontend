import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { StackItem, Stack } from '@patternfly/react-core';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { TasksTabs } from '../../PresentationalComponents';
import RunTaskModal from '../RunTaskModal/RunTaskModal';
import {
  TASKS_PAGE_HEADER,
  TASKS_PAGE_HEADER_FLEX_PROPS,
  TASKS_PAGE_TABS,
} from '../../constants';
import FlexibleFlex from '../../PresentationalComponents/FlexibleFlex/FlexibleFlex';
import AvailableTasks from '../AvailableTasks/AvailableTasks';
import ActivityTable from '../../SmartComponents/ActivityTable/ActivityTable';
import { fetchAvailableTask } from '../../../api';
import { dispatchNotification } from '../../Utilities/Dispatcher';

import './tasks-page.scss';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

const TasksPage = ({ tab }) => {
  const [tabIndex, setTab] = useState(tab);
  const [runTaskModalOpened, setRunTaskModalOpened] = useState(false);
  const [activeTask, setActiveTask] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    setTab(tab);
    setRunTaskModalOpened(false);
  }, [tab]);

  const navigate = useInsightsNavigate();

  const updateTab = (event, index) => {
    navigate(index ? '/executed' : '/available');
  };

  const openTaskModal = async (value, slug) => {
    const task = await fetchAvailableTask(slug);
    if (task?.response?.status && task?.response?.status !== 200) {
      setError(task);
      dispatchNotification({
        variant: 'danger',
        title: 'Error',
        description: task.message,
        dismissable: true,
        autoDismiss: false,
      });
    } else {
      setActiveTask(task);
    }

    setRunTaskModalOpened(value);
  };

  return (
    <React.Fragment>
      {runTaskModalOpened ? (
        <RunTaskModal
          description={activeTask.description}
          error={error}
          isOpen={runTaskModalOpened}
          parameters={activeTask.parameters}
          selectedSystems={[]}
          setModalOpened={setRunTaskModalOpened}
          slug={activeTask.slug}
          title={activeTask.title}
          filterMessage={activeTask.filter_message}
        />
      ) : null}
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
    </React.Fragment>
  );
};

TasksPage.propTypes = {
  tab: propTypes.number,
};

export default TasksPage;
