import React from 'react';
import propTypes from 'prop-types';
import { Button, Content,  } from '@patternfly/react-core';
import ReactMarkdown from 'react-markdown';
import {
  AVAILABLE_TASKS_ROOT,
  CONVERSION_SLUG,
  TASKS_API_ROOT,
} from '../../constants';
import { DownloadIcon } from '@patternfly/react-icons';
import {
  QuickstartButton,
  SLUG_TO_QUICKSTART,
} from '../AvailableTasks/QuickstartButton';

const scriptOrPlaybook = (slug) => {
  return slug?.includes(CONVERSION_SLUG) ? 'script' : 'playbook';
};

const TaskDescription = ({ description, slug, isTaskCard }) => {
  return (
    <Content>
      {!isTaskCard && <Content component="h4">Task description</Content>}
      <Content component="p">
        <ReactMarkdown
          components={{
            a(props) {
              const { node, ...rest } = props;
              return (
                <a
                  href={node.properties.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...rest}
                />
              );
            },
          }}
        >
          {description}
        </ReactMarkdown>
      </Content>
      <Content component="p">
        <Button
          variant="link"
          component="a"
          href={`${TASKS_API_ROOT}${AVAILABLE_TASKS_ROOT}/${slug}/playbook`}
          icon={<DownloadIcon />}
          iconPosition="end"
          isInline
          style={{ marginRight: '16px' }}
        >
          {`Download preview of ${scriptOrPlaybook(slug)}`}
        </Button>
        {!isTaskCard && Object.keys(SLUG_TO_QUICKSTART).includes(slug) && (
          <QuickstartButton slug={slug} />
        )}
      </Content>
    </Content>
  );
};

TaskDescription.propTypes = {
  description: propTypes.string,
  isTaskCard: propTypes.bool,
  node: propTypes.object,
  slug: propTypes.string,
};

export { TaskDescription };
