import React from 'react';
import propTypes from 'prop-types';
import { Button, Text, TextContent } from '@patternfly/react-core';
import ReactMarkdown from 'react-markdown';
import { AVAILABLE_TASKS_ROOT, TASKS_API_ROOT } from '../../constants';
import { DownloadIcon } from '@patternfly/react-icons';
import {
  QuickstartButton,
  SLUG_TO_QUICKSTART,
} from '../AvailableTasks/QuickstartButton';

const TaskDescription = ({ description, slug }) => {
  return (
    <TextContent>
      <Text component="h4">Task description</Text>
      <Text>
        <ReactMarkdown>{description}</ReactMarkdown>
      </Text>
      <Text>
        <Button
          variant="link"
          component="a"
          href={`${TASKS_API_ROOT}${AVAILABLE_TASKS_ROOT}/${slug}/playbook`}
          icon={<DownloadIcon />}
          iconPosition="end"
          isInline
        >
          Download preview of playbook
        </Button>
        {Object.keys(SLUG_TO_QUICKSTART).includes(slug) && (
          <QuickstartButton slug={slug} />
        )}
      </Text>
    </TextContent>
  );
};

TaskDescription.propTypes = {
  description: propTypes.string,
  slug: propTypes.string,
};

export { TaskDescription };
