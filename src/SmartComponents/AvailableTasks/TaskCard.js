import {
  Card,
  CardBody,
  CardExpandableContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  AVAILABLE_TASKS_ROOT,
  CONVERSION_SLUG,
  TASKS_API_ROOT,
} from '../../constants';
import RunTaskButton from '../../PresentationalComponents/RunTaskButton/RunTaskButton';
import { QuickstartButton, SLUG_TO_QUICKSTART } from './QuickstartButton';
import PropTypes from 'prop-types';

const scriptOrPlaybook = (slug) => {
  return slug.includes(CONVERSION_SLUG) ? 'script' : 'playbook';
};

const TaskCard = ({ task, openTaskModal }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div aria-label={task.title} key={task.title}>
      <Card isExpanded={isExpanded}>
        <CardHeader
          onExpand={() => setIsExpanded(!isExpanded)}
          toggleButtonProps={{
            'data-ouia-component-id': `Expand ${task.title} description`,
            'aria-label': `Expand ${task.title} description`,
            'aria-expanded': isExpanded,
          }}
        >
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardExpandableContent>
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
        </CardExpandableContent>
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
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  openTaskModal: PropTypes.func.isRequired,
};

export { TaskCard };
