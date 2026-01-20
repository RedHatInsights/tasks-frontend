import React from 'react';
import RunTaskModalRoute from '../RunTaskModalRoute';
import { fetchAvailableTask } from '../../../../api';
import { render, screen, waitFor } from '@testing-library/react';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';

// eslint-disable-next-line react/display-name
jest.mock('../RunTaskModal', () => () => <span>RunTaskModal</span>);
jest.mock('../../../../api');
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useParams: () => ({
    slug: 'test-slug',
  }),
}));
jest.mock('@redhat-cloud-services/frontend-components-notifications', () => ({
  useAddNotification: jest.fn(),
}));

describe('RunTaskModalRoute', () => {
  const mockAddNotification = jest.fn();

  beforeEach(() => {
    useAddNotification.mockReturnValue(mockAddNotification);
  });

  it('requests api and renders the modal', async () => {
    render(<RunTaskModalRoute />);

    await waitFor(() => {
      expect(fetchAvailableTask).toBeCalledWith('test-slug');
    });
    screen.getByText(/runtaskmodal/i);
  });

  it('dispatches an error on failed request', async () => {
    fetchAvailableTask.mockReturnValue({
      response: {
        status: 404,
      },
      message: 'Test error',
    });
    render(<RunTaskModalRoute />);

    await waitFor(() => {
      expect(mockAddNotification).toBeCalledWith(
        expect.objectContaining({ description: 'Test error' })
      );
    });
    screen.getByText(/runtaskmodal/i);
  });
});
