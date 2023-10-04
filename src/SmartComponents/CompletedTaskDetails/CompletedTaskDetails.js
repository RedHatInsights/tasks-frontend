import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import TasksTables from '../../Utilities/hooks/useTableTools/Components/TasksTables';
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
import BreadcrumbLinkItem from '../../PresentationalComponents/BreadcrumbLinkItem/BreadcrumbLinkItem';
import {
  getSelectedSystems,
  fetchTask,
  fetchTaskJobs,
  hasDetails,
} from '../completedTaskDetailsHelpers';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import JobResultsDetails from './JobResultsDetails/JobResultsDetails';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import ReactMarkdown from 'react-markdown';

const CompletedTaskDetails = () => {
  const { id } = useParams();
  const [completedTaskDetails, setCompletedTaskDetails] =
    useState(LOADING_INFO_PANEL);
  const [completedTaskJobs, setCompletedTaskJobs] =
    useState(LOADING_JOBS_TABLE);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState();
  const [runTaskModalOpened, setRunTaskModalOpened] = useState(false);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [isDeleteCancelModalOpened, setIsDeleteCancelModalOpened] =
    useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const chrome = useChrome();
  const { hasAccess, isLoading } = usePermissions('inventory', [
    'inventory:hosts:*',
    'inventory:hosts:read',
  ]);
  const navigate = useInsightsNavigate();

  const fetchData = async () => {
    setTableLoading(true);
    await setCompletedTaskDetails(LOADING_INFO_PANEL);
    await setCompletedTaskJobs(LOADING_JOBS_TABLE);
    const fetchedTaskDetails = await fetchTask(id, setError);

    if (Object.keys(fetchedTaskDetails).length) {
      const fetchedTaskJobs = await fetchTaskJobs(fetchedTaskDetails, setError);

      if (fetchedTaskJobs.length) {
        await setCompletedTaskDetails(fetchedTaskDetails);
        await setCompletedTaskJobs(fetchedTaskJobs);
      }
    }
    setTableLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    completedTaskDetails &&
      chrome.updateDocumentTitle(
        `${completedTaskDetails.name} - Tasks | Red Hat Insights`
      );
  }, [chrome, completedTaskDetails]);

  useEffect(() => {
    setSelectedSystems(getSelectedSystems(completedTaskJobs));
  }, [completedTaskJobs]);

  useEffect(() => {
    if (isDelete) {
      navigate('/executed');
      setIsDelete(false);
    }

    if (isCancel) {
      fetchData();
      setIsCancel(false);
    }
  }, [isCancel, isDelete]);

  const JobResultsRow = useMemo(
    () =>
      function Row(props) {
        return (
          <JobResultsDetails
            taskSlug={completedTaskDetails.task_slug}
            {...props}
          />
        );
      },
    [completedTaskJobs]
  );

  return (
    <div>
      <RunTaskModal
        description={completedTaskDetails.task_description}
        error={error}
        isOpen={runTaskModalOpened}
        selectedSystems={selectedSystems}
        setModalOpened={setRunTaskModalOpened}
        slug={completedTaskDetails.task_slug}
        title={completedTaskDetails.name}
      />
      <DeleteCancelTaskModal
        id={completedTaskDetails.id}
        isOpen={isDeleteCancelModalOpened}
        setIsCancel={setIsCancel}
        setIsDelete={setIsDelete}
        setModalOpened={setIsDeleteCancelModalOpened}
        startTime={completedTaskDetails.start_time}
        status={completedTaskDetails.status}
        title={completedTaskDetails.name}
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
              <BreadcrumbLinkItem to="/executed">Tasks</BreadcrumbLinkItem>
              <BreadcrumbItem isActive>
                {completedTaskDetails.name}
              </BreadcrumbItem>
            </Breadcrumb>
            <Flex direction={{ default: 'column', md: 'row' }}>
              <Flex
                direction={{ default: 'column' }}
                flex={{ default: 'flex_1' }}
              >
                <FlexItem>
                  <PageHeaderTitle title={completedTaskDetails.name} />
                </FlexItem>
                <FlexItem>
                  <ReactMarkdown>
                    {completedTaskDetails.task_description}
                  </ReactMarkdown>
                </FlexItem>
              </Flex>
              <FlexibleFlex
                data={completedTaskDetails}
                flexContents={COMPLETED_INFO_BUTTONS(
                  completedTaskDetails.task_slug,
                  setRunTaskModalOpened,
                  completedTaskDetails.status,
                  setIsDeleteCancelModalOpened
                )}
                flexProps={COMPLETED_INFO_BUTTONS_FLEX_PROPS}
              />
            </Flex>
          </PageHeader>
          <section className="pf-l-page__main-section pf-c-page__main-section">
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
              {!isLoading && hasAccess ? (
                <TasksTables
                  label={`${completedTaskDetails.id}-completed-jobs`}
                  ouiaId={`${completedTaskDetails.id}-completed-jobs-table`}
                  columns={columns}
                  items={completedTaskJobs}
                  filters={{
                    filterConfig: [...systemFilter, ...statusFilters],
                  }}
                  options={{
                    ...TASKS_TABLE_DEFAULTS,
                    exportable: {
                      ...TASKS_TABLE_DEFAULTS.exportable,
                      columns: exportableColumns,
                    },
                    detailsComponent: completedTaskJobs.some((job) =>
                      hasDetails(job)
                    )
                      ? JobResultsRow
                      : undefined,
                  }}
                  emptyRows={emptyRows('jobs')}
                  isStickyHeader
                  isTableLoading={tableLoading}
                />
              ) : (
                <NotAuthorized serviceName="Inventory" />
              )}
            </Card>
          </section>
        </React.Fragment>
      )}
    </div>
  );
};

export default CompletedTaskDetails;
