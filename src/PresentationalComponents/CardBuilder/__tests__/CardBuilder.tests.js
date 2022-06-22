import React from 'react';
import { render } from '@testing-library/react';
import { Flex, FlexItem } from '@patternfly/react-core';

import CardBuilder, { CardBuilderContent } from '../CardBuilder';
import RunTaskButton from '../../RunTaskButton/RunTaskButton';
import { availableTasksTableItems } from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';

describe('TasksTables', () => {
  let props;

  beforeEach(() => {
    props = {
      cardClass: '',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { asFragment } = render(
      <CardBuilder {...props}>
        <CardBuilderContent content="Task title" type="title" />
        <CardBuilderContent content="Task description" type="body" />
        <CardBuilderContent
          content={
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <a href="#">Download preview of playbook</a>
              </FlexItem>
              <FlexItem>
                <RunTaskButton
                  isFirst
                  openTaskModal={jest.fn()}
                  task={availableTasksTableItems[0]}
                  variant="primary"
                />
              </FlexItem>
            </Flex>
          }
          type="footer"
        />
      </CardBuilder>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
