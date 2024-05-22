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
import RunTaskButton from '../../PresentationalComponents/RunTaskButton/RunTaskButton';
import { QuickstartButton, SLUG_TO_QUICKSTART } from './QuickstartButton';
import PropTypes from 'prop-types';
import { TaskDescription } from '../RunTaskModal/TaskDescription';

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
                <TaskDescription
                  description={task.description}
                  slug={task.slug}
                  isTaskCard
                />
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
              <QuickstartButton slug={task.slug} isTaskCard />
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
  node: PropTypes.object,
};

export { TaskCard };
