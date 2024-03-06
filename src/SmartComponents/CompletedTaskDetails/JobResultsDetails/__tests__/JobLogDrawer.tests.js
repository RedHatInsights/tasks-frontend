import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import JobLogDrawer from '../JobLogDrawer';
import { getLogs } from '../../../../../api';

jest.mock('../../../../../api');

describe('JobLogDrawer', () => {
  it('renders without crashing', () => {
    render(<JobLogDrawer />);
  });

  it('fetches logs when drawer is expanded', async () => {
    getLogs.mockResolvedValue('Mocked logs');

    render(
      <JobLogDrawer
        isLogDrawerExpanded={true}
        jobId={1}
        jobName="system1"
        setIsLogDrawerExpanded={() => jest.fn()}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(getLogs).toHaveBeenCalledWith(1);
  });

  it('does not fetch logs when drawer is not expanded', () => {
    render(<JobLogDrawer isLogDrawerExpanded={false} jobId={1} />);

    expect(getLogs).not.toHaveBeenCalled();
  });

  it('closes the drawer when close button is clicked', () => {
    const mockSetIsLogDrawerExpanded = jest.fn();

    const { getByRole } = render(
      <JobLogDrawer
        isLogDrawerExpanded={true}
        setIsLogDrawerExpanded={mockSetIsLogDrawerExpanded}
      />
    );

    fireEvent.click(getByRole('button'));

    expect(mockSetIsLogDrawerExpanded).toHaveBeenCalledWith(false);
  });
});
