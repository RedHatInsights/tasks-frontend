import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LogDrawerDetails from '../LogDrawerDetails';

describe('LogDrawerDetails', () => {
  const jobName = 'Test Job';
  const logs = 'Sample log data';

  test('renders log viewer with correct props', () => {
    render(<LogDrawerDetails jobName={jobName} logs={logs} />);

    // Assert that the LogViewer component is rendered with the correct props
    expect(screen.getByText('Sample log data')).toBeVisible();
  });

  test('calls downloadFile function when download button is clicked', () => {
    render(<LogDrawerDetails jobName={jobName} logs={logs} />);

    jest.spyOn(global, 'URL').mockReturnValueOnce({
      createObjectURL: jest.fn(),
    });
    global.URL.createObjectURL = jest.fn();

    // Click the download button
    fireEvent.click(screen.getByTestId('download-button'));

    // Assert that the downloadFile function is called with the correct arguments
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));

    // Restore the mock
    global.URL.createObjectURL.mockRestore();
  });

  test('opens log in new tab when open button is clicked', () => {
    render(<LogDrawerDetails jobName={jobName} logs={logs} />);

    jest.spyOn(global, 'URL').mockReturnValueOnce({
      createObjectURL: jest.fn(),
    });
    global.URL.createObjectURL = jest.fn();

    // Click the open log in new tab button
    fireEvent.click(
      screen.getByRole('button', {
        name: /open log in new tab/i,
      })
    );

    // Assert that the openInNewTab function is called with the correct arguments
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));

    // Restore the mock
    global.URL.createObjectURL.mockRestore();
  });
});
