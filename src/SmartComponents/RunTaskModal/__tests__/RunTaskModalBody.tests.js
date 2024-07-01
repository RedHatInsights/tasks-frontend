import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import fixtures from './__fixtures__/RunTaskModal.fixtures';

import RunTaskModalBody from '../RunTaskModalBody';

jest.mock('../../../Utilities/useFeatureFlag', () => () => true);

describe('RunTaskModalBody', () => {
  let props;
  const store = init().getStore();

  beforeEach(() => {
    props = {
      areSystemsSelected: false,
      createTaskError: {},
      description: 'This is a task description',
      error: null,
      parameters: fixtures.parameters,
      selectedIds: [],
      setDefinedParameters: jest.fn(),
      setSelectedIds: jest.fn(),
      setTaskName: jest.fn(),
      slug: 'task-a',
      taskName: 'Task name',
      filterMessage: 'This is the filter message',
    };
  });

  it('should render error', async () => {
    props.error = {
      response: {
        status: 404,
      },
      message: 'This is an error.',
    };

    render(
      <Provider store={store}>
        <RunTaskModalBody {...props} />
      </Provider>
    );

    expect(
      screen.getByText('This task cannot be displayed')
    ).toBeInTheDocument();
  });

  it('should render SystemsSelect', async () => {
    render(
      <Provider store={store}>
        <RunTaskModalBody {...props} />
      </Provider>
    );

    expect(screen.getByText('Systems to run tasks on')).toBeInTheDocument();
  });

  it('should render InputParameters', async () => {
    props.areSystemsSelected = true;
    render(
      <Provider store={store}>
        <RunTaskModalBody {...props} />
      </Provider>
    );

    expect(screen.getByText('Playbook Path')).toBeInTheDocument();
    expect(screen.getByText('Help Text')).toBeInTheDocument();
    expect(screen.getByText('Add Tags')).toBeInTheDocument();
    expect(screen.getByText('Remove_Tags')).toBeInTheDocument();
    expect(screen.getByText('blah')).toBeInTheDocument();
  });

  it('should render quickstart button for pre-conversion tasks', () => {
    render(
      <Provider store={store}>
        <RunTaskModalBody {...props} slug="convert-to-rhel-analysis" />
      </Provider>
    );

    expect(
      screen.getByRole('button', {
        name: /help me get started/i,
      })
    ).toBeVisible();
  });

  it('should render quickstart button for conversion tasks', () => {
    render(
      <Provider store={store}>
        <RunTaskModalBody {...props} slug="convert-to-rhel-conversion" />
      </Provider>
    );

    expect(
      screen.getByRole('button', {
        name: /help me get started/i,
      })
    ).toBeVisible();
  });

  it('should not render quickstart button for other tasks', () => {
    render(
      <Provider store={store}>
        <RunTaskModalBody {...props} />
      </Provider>
    );

    expect(
      screen.queryByRole('button', {
        name: /help me get started/i,
      })
    ).not.toBeInTheDocument();
  });
});
