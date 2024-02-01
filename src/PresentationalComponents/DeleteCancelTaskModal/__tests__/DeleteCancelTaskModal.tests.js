import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { deleteExecutedTask } from '../../../../api';
import * as dispatcher from '../../../Utilities/Dispatcher';

import DeleteCancelTaskModal from '../DeleteCancelTaskModal';

jest.mock('../../../../api');

describe('DeleteCancelTaskModal', () => {
  let props;

  beforeEach(() => {
    props = {
      id: ['abcd-1234'],
      isOpen: true,
      setIsDelete: jest.fn(),
      setModalOpened: jest.fn(),
      startTime: '2022-04-20T10:10:00',
      title: 'TaskA',
    };
  });

  it('should render correctly', async () => {
    render(
      <MemoryRouter>
        <DeleteCancelTaskModal {...props} />
      </MemoryRouter>
    );
    expect(
      screen.getByLabelText('cancel-delete-task-modal')
    ).toBeInTheDocument();
  });

  it('should cancel modal', async () => {
    render(
      <MemoryRouter>
        <DeleteCancelTaskModal {...props} />
      </MemoryRouter>
    );

    await waitFor(() =>
      userEvent.click(screen.getByLabelText('cancel-delete-modal-button'))
    );
    expect(props.setModalOpened).toHaveBeenCalled();
  });

  it('should delete task', async () => {
    deleteExecutedTask.mockImplementation(async () => {
      return {
        response: { status: 200 },
      };
    });

    render(
      <MemoryRouter>
        <DeleteCancelTaskModal {...props} />
      </MemoryRouter>
    );

    await waitFor(() =>
      userEvent.click(screen.getByTestId('delete-task-button'))
    );
    expect(props.setIsDelete).toHaveBeenCalled();
  });

  it('should create notification on failed delete task', async () => {
    deleteExecutedTask.mockImplementation(async () => {
      return {
        response: { status: 400 },
      };
    });

    const notification = jest
      .spyOn(dispatcher, 'dispatchNotification')
      .mockImplementation();
    render(
      <MemoryRouter>
        <DeleteCancelTaskModal {...props} />
      </MemoryRouter>
    );

    await waitFor(() =>
      userEvent.click(screen.getByTestId('delete-task-button'))
    );
    expect(notification).toHaveBeenCalled();
  });

  it('should close modal on X click', async () => {
    render(
      <MemoryRouter>
        <DeleteCancelTaskModal {...props} />
      </MemoryRouter>
    );

    await waitFor(() => userEvent.click(screen.getByLabelText('Close')));
    expect(props.setModalOpened).toHaveBeenCalledWith(false);
  });
});
