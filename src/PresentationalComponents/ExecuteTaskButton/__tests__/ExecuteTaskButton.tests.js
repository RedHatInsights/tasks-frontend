import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';

import ExecuteTaskButton from '../ExecuteTaskButton';
import { executeTask } from '../../../../api';
import { successResponse } from '../../../SmartComponents/__tests__/__fixtures__/completedTaskDetailsHelpers.fixtures';

jest.mock('../../../../api');

describe('ExecuteTaskButton', () => {
  let props;
  const store = init().getStore();

  beforeEach(() => {
    props = {
      classname: 'some-class-name',
      ids: ['abcd-1234'],
      setExecuteTaskResult: jest.fn(),
      slug: 'taska',
      taskName: 'Task A',
      variant: 'primary',
    };
  });

  it('should render correctly', async () => {
    const { asFragment } = render(<ExecuteTaskButton {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should execute on click', async () => {
    executeTask.mockImplementation(async () => {
      return {
        successResponse,
        data: { id: '1' },
      };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ExecuteTaskButton {...props} />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() =>
      userEvent.click(screen.getByLabelText('taska-submit-task-button'))
    );
    expect(props.setExecuteTaskResult).toHaveBeenCalled();
  });
});
