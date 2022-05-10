import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import columns, { exportableColumns } from './Columns';
//import { fetchExecutedTask, fetchExecutedTaskJobs } from '../../../api';
import { completedTaskJobsItems } from '../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import * as Filters from './Filters';
import {
  COMPLETED_INFO_PANEL,
  COMPLETED_INFO_PANEL_FLEX_PROPS,
  COMPLETED_INFO_BUTTONS,
  COMPLETED_INFO_BUTTONS_FLEX_PROPS,
  TASKS_TABLE_DEFAULTS,
} from '../../constants';
import {
  log4j_task,
  upgrade_leap_task,
} from './__tests__/__fixtures__/completedTasksDetails.fixtures';
import FlexibleFlex from '../../Utilities/hooks/useTableTools/Components/FlexibleFlex';

const CompletedTaskDetails = () => {
  const { id } = useParams();
  const filters = Object.values(Filters);
  //const filters = Object.values(Filters);
  const [completedTaskDetails, setCompletedTaskDetails] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      let taskDetails;
      //const taskDetails = fetchExecutedTask(id);
      //const taskJobs = fetchExecutedTaskJobs(id);
      if (id == 1) {
        taskDetails = log4j_task;
      } else {
        taskDetails = upgrade_leap_task;
      }
      taskDetails.messages_count = completedTaskJobsItems.filter((item) => {
        return item.message !== 'No vulnerability found.';
      }).length;

      setCompletedTaskDetails(taskDetails);
    };

    fetchData();
  }, []);

  return (
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
          <Flex direction={{ default: 'column' }} flex={{ default: 'flex_1' }}>
            <FlexItem>
              <PageHeaderTitle title={completedTaskDetails.task_title} />
            </FlexItem>
            <FlexItem>{completedTaskDetails.description}</FlexItem>
          </Flex>
          <FlexibleFlex
            data={completedTaskDetails}
            flexContents={COMPLETED_INFO_BUTTONS}
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
            items={completedTaskJobsItems}
            filters={{
              filterConfig: filters,
            }}
            options={{
              ...TASKS_TABLE_DEFAULTS,
              exportable: {
                ...TASKS_TABLE_DEFAULTS.exportable,
                columns: exportableColumns,
              },
            }}
            //items={completedTasks}
            //emptyRows={emptyRows}
            isStickyHeader
          />
        </Card>
      </Main>
    </React.Fragment>
  );
};

export default CompletedTaskDetails;
