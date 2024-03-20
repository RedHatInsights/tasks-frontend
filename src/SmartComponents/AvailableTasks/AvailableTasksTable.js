import React from 'react';
import propTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import RunTaskButton from '../../PresentationalComponents/RunTaskButton/RunTaskButton';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  AVAILABLE_TASKS_ROOT,
  CONVERSION_SLUG,
  EMPTY_TASKS_MESSAGE,
  EMPTY_TASKS_TITLE,
  TASKS_API_ROOT,
  TASKS_ERROR,
} from '../../constants';
import ReactMarkdown from 'react-markdown';
import { QuickstartButton, SLUG_TO_QUICKSTART } from './QuickstartButton';

const AvailableTasksTable = ({ availableTasks, error, openTaskModal }) => {
  const scriptOrPlaybook = (slug) => {
    return slug.includes(CONVERSION_SLUG) ? 'script' : 'playbook';
  };

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
            <div aria-label={task.title} key={task.title}>
              <Card>
                <CardTitle>{task.title}</CardTitle>
                <CardBody className="card-task-description">
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <ReactMarkdown>{task.description}</ReactMarkdown>
                    </FlexItem>
                    <FlexItem>
                      <a
                        href={`${TASKS_API_ROOT}${AVAILABLE_TASKS_ROOT}/${task.slug}/playbook`}
                      >
                        {`Download preview of ${scriptOrPlaybook(task.slug)}`}
                      </a>
                    </FlexItem>
                  </Flex>
                </CardBody>
                <CardFooter>
                  <Flex>
                    <RunTaskButton
                      slug={task.slug}
                      isFirst
                      variant="primary"
                      openTaskModal={openTaskModal}
                    />
                    {Object.keys(SLUG_TO_QUICKSTART).includes(task.slug) && (
                      <QuickstartButton slug={task.slug} />
                    )}
                  </Flex>
                </CardFooter>
              </Card>
              <br />
            </div>
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
