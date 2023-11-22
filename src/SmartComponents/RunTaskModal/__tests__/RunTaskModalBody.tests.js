import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import fixtures from './__fixtures__/RunTaskModal.fixtures';

import RunTaskModalBody from '../RunTaskModalBody';

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

    expect(screen.getByText('path')).toBeInTheDocument();
    expect(screen.getByText('this-is-your-label')).toBeInTheDocument();
    expect(screen.getByText('Add_Tags')).toBeInTheDocument();
    expect(screen.getByText('Remove_Tags')).toBeInTheDocument();
    expect(screen.getByText('blah')).toBeInTheDocument();
  });
});
