import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import fixtures from './__fixtures__/RunTaskModal.fixtures';
import { fetchSystems } from '../../../../api';
import { systemsMock } from '../../SystemTable/__tests__/__fixtures__/SystemTable.fixtures';

import RunTaskModal from '../RunTaskModal';
import userEvent from '@testing-library/user-event';

jest.mock('../../../Utilities/Dispatcher');
jest.mock('../../../../api');
jest.mock('../../SystemTable/hooks', () => {
  const systemsMock = [
    {
      display_name:
        'rhiqe.8d8fe668-c2ee-4034-b174-2af31020402c.email-38.alvarez.com',
      id: '1d2a2d8b-8bb1-48f3-a367-c8ba2f4d8fc3',
      os_version: 'RHEL 8.4',
      updated: '2022-04-20T12:49:29.389485Z',
      tags: [{ key: 'UZYyIQY', value: 'vMRGEY', namespace: 'kQQgFpq' }],
    },
    {
      display_name: 'rhiqe.laptop-44.sanchez-mann.biz',
      id: 'aa28f81c-e7f0-4ee4-af46-0352b0fb50f3',
      os_version: 'RHEL 8.4',
      tags: [
        { key: 'dMVLDZtE', value: 'EcuyHgqoa', namespace: 'SOxjI' },
        { key: 'pJASDVJ', value: 'QhfoGAgZO', namespace: 'TCPVO' },
        { key: 'KAWxWyCKH', value: 'RkZRaq', namespace: 'bzitQU' },
        { key: 'MGTHlDoYt', value: 'yGFpfHc', namespace: 'OJkHjnM' },
        { key: 'fcxDtpYt', value: 'PwOPRFiv', namespace: 'wWZCjhrp' },
      ],
      updated: '2022-05-04T07:08:37.176240Z',
    },
  ];
  return {
    ...jest.requireActual('../../SystemTable/hooks'),
    useGetEntities: jest.fn(() => Promise.resolve(systemsMock)),
  };
});

describe('RunTaskModal', () => {
  let props;
  const store = init().getStore();

  beforeEach(() => {
    props = {
      description: 'This is a description of the task.',
      isOpen: true,
      name: '',
      selectedSystems: [],
      setModalOpened: jest.fn(),
      slug: 'taska',
      title: 'This is the title of the task',
    };
  });

  it('should render run task button first disabled', () => {
    fetchSystems.mockImplementation(async () => {
      return {
        response: systemsMock,
      };
    });
    render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    expect(
      screen.getByRole('button', {
        name: /taska\-submit\-task\-button/i,
      })
    ).toBeDisabled();
  });

  it('should enable run task button', async () => {
    fetchSystems.mockImplementation(async () => {
      return {
        response: systemsMock,
      };
    });
    const { rerender } = render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    // add name, button should still be disabled
    const input = screen.getByRole('textbox', {
      name: /edit task name text field/i,
    });
    await userEvent.type(input, 'Task A');
    expect(
      screen.getByRole('button', {
        name: /taska\-submit\-task\-button/i,
      })
    ).toBeDisabled();

    // add selected Systems, button should be enabled
    rerender(
      <Provider store={store}>
        <RunTaskModal {...props} selectedSystems={['123']} />
      </Provider>
    );
    expect(
      screen.getByRole('button', {
        name: /taska\-submit\-task\-button/i,
      })
    ).toBeEnabled();
  });

  it('should disable task on empty task name', async () => {
    fetchSystems.mockImplementation(async () => {
      return {
        response: systemsMock,
      };
    });
    render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    await userEvent.type(
      screen.getByRole('textbox', {
        name: /edit task name text field/i,
      }),
      ''
    );
    screen.getByText(/task name cannot be empty/i);
    expect(
      screen.getByRole('textbox', {
        name: /edit task name text field/i,
      })
    ).toBeInvalid();
  });

  it('should close modal with "X" button', async () => {
    render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    const closeButton = screen.getByLabelText('Close');
    await waitFor(() => userEvent.click(closeButton));
    expect(props.setModalOpened).toHaveBeenCalledWith(false);
  });

  it('should cancel modal with no params on system select', async () => {
    render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    const cancelButton = screen.getByLabelText('cancel-run-task-modal');
    await waitFor(() => userEvent.click(cancelButton));
    expect(props.setModalOpened).toHaveBeenCalledWith(false);
  });

  it('should cancel modal with params on system select', async () => {
    props.parameters = fixtures.parameters;
    render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    const cancelButton = screen.getByLabelText('cancel-run-task-modal');
    await waitFor(() => userEvent.click(cancelButton));
    expect(props.setModalOpened).toHaveBeenCalledWith(false);
  });

  it('should cancel modal with params on Input Parameters', async () => {
    props.name = 'Task A';
    props.selectedSystems = ['abcd'];
    props.parameters = fixtures.parameters;
    render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    const nextButton = screen.getByLabelText('next-button');
    await waitFor(() => userEvent.click(nextButton));

    const cancelButton = screen.getByLabelText('cancel-run-task-modal');
    await waitFor(() => userEvent.click(cancelButton));
    expect(props.setModalOpened).toHaveBeenCalledWith(false);
  });

  it.skip('should render InputParameters', async () => {
    props.name = 'Task A';
    props.selectedSystems = ['abcd'];
    props.parameters = fixtures.parameters;
    render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    const nextButton = screen.getByLabelText('next-button');
    await waitFor(() => userEvent.click(nextButton));

    expect(screen.getByText('path')).toBeInTheDocument();
    expect(screen.getByText('this-is-your-label')).toBeInTheDocument();
    expect(screen.getByText('Add_Tags')).toBeInTheDocument();
    expect(screen.getByText('Remove_Tags')).toBeInTheDocument();
    expect(screen.getByText('blah')).toBeInTheDocument();
  });

  it('should disable Execute when required parameter is blank', async () => {
    props.name = 'Task A';
    props.selectedSystems = ['abcd'];
    props.parameters = fixtures.parameters;
    render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    const nextButton = screen.getByLabelText('next-button');
    await waitFor(() => userEvent.click(nextButton));

    const executeButton = screen.getByLabelText('taska-submit-task-button');
    expect(executeButton).toBeDisabled();
  });

  it.skip('should show validation when input parameter is empty', async () => {
    props.name = 'Task A';
    props.selectedSystems = ['abcd'];
    props.parameters = fixtures.parameters;
    render(
      <Provider store={store}>
        <RunTaskModal {...props} />
      </Provider>
    );

    const nextButton = screen.getByLabelText('next-button');
    await waitFor(() => userEvent.click(nextButton));

    const input = screen.getByLabelText('path-input');
    await waitFor(() => fireEvent.change(input, { target: { value: 'a' } }));
    await waitFor(() => fireEvent.change(input, { target: { value: '' } }));

    expect(screen.getByText('This parameter is required')).toBeInTheDocument();
  });
});
