import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { StackItem, Stack } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
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
import CompletedTasksTable from '../../SmartComponents/CompletedTasksTable/CompletedTasksTable';
import { fetchAvailableTask } from '../../../api';
import { dispatchNotification } from '../../Utilities/Dispatcher';

import './tasks-page.scss';

const TasksPage = ({ tab }) => {
  const history = useHistory();
  const [tabIndex, setTab] = useState(tab);
  const [runTaskModalOpened, setRunTaskModalOpened] = useState(false);
  const [activeTask, setActiveTask] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    if (tab === 0) {
      history.push('available');
    }
  }, []);

  const updateTab = (event, index) => {
    history.push(index ? 'executed' : 'available');
    setTab(index);
  };

  const openTaskModal = async (slug) => {
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

    setRunTaskModalOpened(true);
  };

  return (
    <React.Fragment>
      <RunTaskModal
        description={activeTask.description}
        error={error}
        isOpen={runTaskModalOpened}
        selectedSystems={[]}
        setModalOpened={setRunTaskModalOpened}
        slug={activeTask.slug}
        title={activeTask.title}
      />
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
      <Main>
        <Stack hasGutter>
          <StackItem>
            {tabIndex === 0 ? (
              <AvailableTasks openTaskModal={openTaskModal} />
            ) : (
              <CompletedTasksTable openTaskModal={openTaskModal} />
            )}
          </StackItem>
        </Stack>
      </Main>
    </React.Fragment>
  );
};

TasksPage.propTypes = {
  tab: propTypes.number,
};

export default TasksPage;
