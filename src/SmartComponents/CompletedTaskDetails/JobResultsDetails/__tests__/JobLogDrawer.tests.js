import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import JobLogDrawer from '../JobLogDrawer';
import { getLogs } from '../../../../../api';

jest.mock('../../../../../api');

describe('JobLogDrawer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

    expect(getLogs).toHaveBeenCalledWith(1);
  });

  it('does not fetch logs when drawer is not expanded', () => {
    render(<JobLogDrawer isLogDrawerExpanded={false} jobId={1} />);

    expect(getLogs).not.toHaveBeenCalled();
  });

  it('closes the drawer when close button is clicked', () => {
    const mockSetIsLogDrawerExpanded = jest.fn();

    render(
      <JobLogDrawer
        isLogDrawerExpanded={true}
        setIsLogDrawerExpanded={mockSetIsLogDrawerExpanded}
      />
    );

    fireEvent.click(screen.getByLabelText('Close drawer panel'));

    expect(mockSetIsLogDrawerExpanded).toHaveBeenCalledWith(false);
  });
});
