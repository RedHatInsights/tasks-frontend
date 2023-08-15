import React from 'react';
import propTypes from 'prop-types';
import { Flex, FlexItem } from '@patternfly/react-core';
import CardBuilder, {
  CardBuilderContent,
} from '../../PresentationalComponents/CardBuilder/CardBuilder';
import RunTaskButton from '../../PresentationalComponents/RunTaskButton/RunTaskButton';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  AVAILABLE_TASKS_ROOT,
  EMPTY_TASKS_MESSAGE,
  EMPTY_TASKS_TITLE,
  TASKS_API_ROOT,
  TASKS_ERROR,
} from '../../constants';

const AvailableTasksTable = ({ availableTasks, error, openTaskModal }) => {
  return (
    <div aria-label="available-tasks-table">
      {error ? (
        <EmptyStateDisplay
          icon={ExclamationCircleIcon}
          color="#c9190b"
          title={'Available tasks cannot be displayed'}
          text={TASKS_ERROR}
          error={`Error ${error?.response?.status}: ${error?.message}`}
        />
      ) : !availableTasks?.length ? (
        <EmptyStateDisplay
          title={EMPTY_TASKS_TITLE}
          text={EMPTY_TASKS_MESSAGE}
        />
      ) : (
        availableTasks?.map((task) => {
          return (
            <React.Fragment aria-label={task.title} key={task.title}>
              <CardBuilder>
                <CardBuilderContent content={task.title} type="title" />
                <CardBuilderContent
                  className="card-task-description"
                  content={task.description}
                  type="body"
                />
                <CardBuilderContent
                  content={
                    <Flex direction={{ default: 'column' }}>
                      <FlexItem>
                        <a
                          href={`${TASKS_API_ROOT}${AVAILABLE_TASKS_ROOT}/${task.slug}/playbook`}
                        >
                          Preview of a script to be executed on the host(s)
                        </a>
                      </FlexItem>
                      <FlexItem>
                        <RunTaskButton
                          slug={task.slug}
                          isFirst
                          variant="primary"
                          openTaskModal={openTaskModal}
                        />
                      </FlexItem>
                    </Flex>
                  }
                  type="footer"
                />
              </CardBuilder>
              <br />
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};

AvailableTasksTable.propTypes = {
  availableTasks: propTypes.array,
  error: propTypes.object,
  openTaskModal: propTypes.func,
};

export default AvailableTasksTable;
