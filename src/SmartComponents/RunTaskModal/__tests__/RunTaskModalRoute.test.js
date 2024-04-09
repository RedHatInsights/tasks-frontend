import React from 'react';
import RunTaskModalRoute from '../RunTaskModalRoute';
import { fetchAvailableTask } from '../../../../api';
import { render, screen, waitFor } from '@testing-library/react';
import { dispatchNotification } from '../../../Utilities/Dispatcher';

// eslint-disable-next-line react/display-name
jest.mock('../RunTaskModal', () => () => <span>RunTaskModal</span>);
jest.mock('../../../../api');
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useParams: () => ({
    slug: 'test-slug',
  }),
}));
jest.mock('../../../Utilities/Dispatcher');

describe('RunTaskModalRoute', () => {
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
      expect(dispatchNotification).toBeCalledWith(
        expect.objectContaining({ description: 'Test error' })
      );
    });
    screen.getByText(/runtaskmodal/i);
  });
});
