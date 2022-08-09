import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import TasksTables from '../../Utilities/hooks/useTableTools/Components/TasksTables';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import columns, { exportableColumns } from './Columns';
import { statusFilters, systemFilter } from './Filters';
import {
  COMPLETED_INFO_PANEL,
  COMPLETED_INFO_PANEL_FLEX_PROPS,
  COMPLETED_INFO_BUTTONS,
  COMPLETED_INFO_BUTTONS_FLEX_PROPS,
  LOADING_INFO_PANEL,
  LOADING_JOBS_TABLE,
  TASK_ERROR,
  TASKS_TABLE_DEFAULTS,
} from '../../constants';
import FlexibleFlex from '../../PresentationalComponents/FlexibleFlex/FlexibleFlex';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import RunTaskModal from '../RunTaskModal/RunTaskModal';
import DeleteCancelTaskModal from '../../PresentationalComponents/DeleteCancelTaskModal/DeleteCancelTaskModal';
import { emptyRows } from '../../PresentationalComponents/NoResultsTable/NoResultsTable';
import {
  getSelectedSystems,
  fetchTask,
  fetchTaskJobs,
} from '../completedTaskDetailsHelpers';

const CompletedTaskDetails = () => {
  const { id } = useParams();
  const [completedTaskDetails, setCompletedTaskDetails] =
    useState(LOADING_INFO_PANEL);
  const [completedTaskJobs, setCompletedTaskJobs] =
    useState(LOADING_JOBS_TABLE);
  const [error, setError] = useState();
  const [runTaskModalOpened, setRunTaskModalOpened] = useState(false);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [isDeleteCancelModalOpened, setIsDeleteCancelModalOpened] =
    useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const history = useHistory();

  const fetchData = async () => {
    const fetchedTaskDetails = await fetchTask(id, setError);

    if (Object.keys(fetchedTaskDetails).length) {
      const fetchedTaskJobs = await fetchTaskJobs(fetchedTaskDetails, setError);

      if (fetchedTaskJobs.length) {
        await setCompletedTaskDetails(fetchedTaskDetails);
        await setCompletedTaskJobs(fetchedTaskJobs);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedSystems(getSelectedSystems(completedTaskJobs));
  }, [completedTaskJobs]);

  useEffect(async () => {
    if (isDelete) {
      history.push('/executed');
      setIsDelete(false);
    }

    if (isCancel) {
      await setCompletedTaskDetails(LOADING_INFO_PANEL);
      await setCompletedTaskJobs(LOADING_JOBS_TABLE);
      await fetchData();
      setIsCancel(false);
    }
  }, [isCancel, isDelete]);

  return (
    <div>
      <RunTaskModal
        description={completedTaskDetails.task_description}
        error={error}
        isOpen={runTaskModalOpened}
        selectedSystems={selectedSystems}
        setModalOpened={setRunTaskModalOpened}
        slug={completedTaskDetails.task_slug}
        title={completedTaskDetails.task_title}
      />
      <DeleteCancelTaskModal
        id={completedTaskDetails.id}
        isOpen={isDeleteCancelModalOpened}
        setIsCancel={setIsCancel}
        setIsDelete={setIsDelete}
        setModalOpened={setIsDeleteCancelModalOpened}
        startTime={completedTaskDetails.start_time}
        status={completedTaskDetails.status}
        title={completedTaskDetails.task_title}
      />
      {error ? (
        <EmptyStateDisplay
          icon={ExclamationCircleIcon}
          color="#c9190b"
          title={'Task cannot be displayed'}
          text={TASK_ERROR}
          error={`Error ${error?.response?.status}: ${error?.message}`}
        />
      ) : (
        <React.Fragment>
          <PageHeader>
            <Breadcrumb ouiaId="completed-tasks-details-breadcrumb">
              <BreadcrumbItem to="/beta/insights/tasks/executed">
                Tasks
              </BreadcrumbItem>
              <BreadcrumbItem isActive>
                {completedTaskDetails.task_title}
              </BreadcrumbItem>
            </Breadcrumb>
            <Flex direction={{ default: 'column', md: 'row' }}>
              <Flex
                direction={{ default: 'column' }}
                flex={{ default: 'flex_1' }}
              >
                <FlexItem>
                  <PageHeaderTitle title={completedTaskDetails.task_title} />
                </FlexItem>
                <FlexItem>{completedTaskDetails.description}</FlexItem>
              </Flex>
              <FlexibleFlex
                data={completedTaskDetails}
                flexContents={COMPLETED_INFO_BUTTONS(
                  completedTaskDetails.task_slug,
                  setRunTaskModalOpened,
                  //completedTaskDetails.status,
                  setIsDeleteCancelModalOpened
                )}
                flexProps={COMPLETED_INFO_BUTTONS_FLEX_PROPS}
              />
            </Flex>
          </PageHeader>
          <Main>
            <Card>
              <Flex
                className="completed-task-details-info-border"
                justifyContent={{ default: 'justifyContentSpaceBetween' }}
                direction={{ default: 'column', md: 'row' }}
              >
                <FlexibleFlex
                  data={completedTaskDetails}
                  flexContents={COMPLETED_INFO_PANEL}
                  flexProps={COMPLETED_INFO_PANEL_FLEX_PROPS}
                />
              </Flex>
            </Card>
            <br />
            <Card>
              <TasksTables
                label={`${completedTaskDetails.id}-completed-jobs`}
                ouiaId={`${completedTaskDetails.id}-completed-jobs-table`}
                columns={columns}
                items={completedTaskJobs}
                filters={{
                  filterConfig: [...statusFilters, ...systemFilter],
                }}
                options={{
                  ...TASKS_TABLE_DEFAULTS,
                  exportable: {
                    ...TASKS_TABLE_DEFAULTS.exportable,
                    columns: exportableColumns,
                  },
                }}
                emptyRows={emptyRows('jobs')}
                isStickyHeader
              />
            </Card>
          </Main>
        </React.Fragment>
      )}
    </div>
  );
};

export default CompletedTaskDetails;
