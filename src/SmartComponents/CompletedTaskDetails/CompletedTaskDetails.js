import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
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
  Page,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import columns, { conversionColumns, exportableColumns } from './Columns';
import { statusFilters, systemFilter } from './Filters';
import {
  COMPLETED_INFO_PANEL,
  COMPLETED_INFO_PANEL_FLEX_PROPS,
  COMPLETED_INFO_BUTTONS,
  COMPLETED_INFO_BUTTONS_FLEX_PROPS,
  CONVERSION_SLUG,
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
import RefreshFooterContent from '../RefreshFooterContent';
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
import { useInterval } from '../../Utilities/hooks/useTableTools/useInterval';
import ParameterDetails from './ParameterDetails';
import JobLogDrawer from './JobResultsDetails/JobLogDrawer';
import useActionResolver from './hooks/useActionResolver';

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
  const [lastUpdated, setLastUpdated] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const [isLogDrawerExpanded, setIsLogDrawerExpanded] = useState(false);
  const [jobId, setJobId] = useState();
  const [jobName, setJobName] = useState();
  const chrome = useChrome();
  const { hasAccess, isLoading } = usePermissions('inventory', [
    'inventory:hosts:*',
    'inventory:hosts:read',
  ]);
  const navigate = useInsightsNavigate();
  const navigateToInventory = useInsightsNavigate('inventory');

  const fetchData = async () => {
    setLastUpdated(` ${moment().format('dddd, MMMM Do YYYY, h:mm a')}`);
    setTableLoading(true);
    const fetchedTaskDetails = await fetchTask(id, setError);

    if (Object.keys(fetchedTaskDetails).length) {
      const fetchedTaskJobs = await fetchTaskJobs(fetchedTaskDetails, setError);

      if (fetchedTaskJobs.length) {
        if (fetchedTaskJobs.some((job) => job.status === 'Running')) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
        await setCompletedTaskDetails(fetchedTaskDetails);
        await setCompletedTaskJobs(fetchedTaskJobs);
      }
    }
    setTableLoading(false);
  };

  useInterval(() => {
    if (isRunning) {
      fetchData();
    }
  }, 60000);

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
    // Not currently being used, but may be used later
    /*if (isCancel) {
      fetchData();
      setIsCancel(false);
    }*/
  }, [isCancel, isDelete]);

  const actionResolver = useActionResolver(
    setIsLogDrawerExpanded,
    setJobId,
    setJobName,
    navigateToInventory
  );

  const JobResultsRow = useMemo(
    () =>
      function Row(props) {
        return (
          <JobResultsDetails
            setIsLogDrawerExpanded={setIsLogDrawerExpanded}
            setJobName={setJobName}
            setJobId={setJobId}
            taskSlug={completedTaskDetails.task_slug}
            {...props}
          />
        );
      },
    [completedTaskJobs]
  );

  const isConversionTask = () => {
    if (
      completedTaskDetails.task_slug ===
        `${CONVERSION_SLUG}-conversion-stage` ||
      completedTaskDetails.task_slug === `${CONVERSION_SLUG}-conversion`
    ) {
      return true;
    } else {
      return false;
    }
  };

  const buildFilterConfig = () => {
    if (isConversionTask()) {
      return { filterConfig: [...systemFilter] };
    } else {
      return { filterConfig: [...systemFilter, ...statusFilters] };
    }
  };

  return (
    <Page
      notificationDrawer={
        <JobLogDrawer
          isLogDrawerExpanded={isLogDrawerExpanded}
          jobName={jobName}
          jobId={jobId}
          setIsLogDrawerExpanded={setIsLogDrawerExpanded}
        />
      }
      isNotificationDrawerExpanded={isLogDrawerExpanded}
      className="my-app-modified-drawer-width"
    >
      {runTaskModalOpened && (
        <RunTaskModal
          description={completedTaskDetails.task_description}
          error={error}
          isOpen={runTaskModalOpened}
          parameters={completedTaskDetails.parameters}
          selectedSystems={selectedSystems}
          setModalOpened={setRunTaskModalOpened}
          slug={completedTaskDetails.task_slug}
          title={completedTaskDetails.name}
          name={completedTaskDetails.name}
          filterMessage={completedTaskDetails.task_filter_message}
        />
      )}
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
            <Flex
              columnGap={{ default: 'columnGapSm' }}
              direction={{ default: 'column', md: 'row' }}
            >
              <Flex
                direction={{ default: 'column' }}
                flex={{ default: 'flex_1' }}
              >
                <FlexItem>
                  <PageHeaderTitle title={completedTaskDetails.name} />
                  <TextContent>
                    <Text component={TextVariants.small}>
                      {completedTaskDetails.task_title}
                    </Text>
                  </TextContent>
                </FlexItem>
                <FlexItem>
                  <ReactMarkdown>
                    {completedTaskDetails.task_description}
                  </ReactMarkdown>
                </FlexItem>
                <ParameterDetails
                  parameters={completedTaskDetails.parameters}
                />
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
          <section className="pf-v5-l-page__main-section pf-v5-c-page__main-section">
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
                  columns={isConversionTask() ? conversionColumns : columns}
                  items={completedTaskJobs}
                  filters={buildFilterConfig()}
                  options={{
                    ...TASKS_TABLE_DEFAULTS,
                    exportable: {
                      ...TASKS_TABLE_DEFAULTS.exportable,
                      columns: isConversionTask()
                        ? conversionColumns
                        : exportableColumns,
                    },
                    detailsComponent: completedTaskJobs.some((job) =>
                      hasDetails(job)
                    )
                      ? JobResultsRow
                      : undefined,
                    actionResolver,
                  }}
                  emptyRows={emptyRows('jobs')}
                  isStickyHeader
                  isTableLoading={tableLoading}
                  footerContent={
                    <RefreshFooterContent
                      footerContent={lastUpdated}
                      isRunning={isRunning}
                      type="jobs"
                    />
                  }
                />
              ) : (
                <NotAuthorized serviceName="Inventory" />
              )}
            </Card>
          </section>
        </React.Fragment>
      )}
    </Page>
  );
};

export default CompletedTaskDetails;
