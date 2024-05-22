import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaskDescription } from '../TaskDescription';

jest.mock('../../../Utilities/useFeatureFlag', () => () => true);

describe('TaskDescription', () => {
  it('renders description', () => {
    render(
      <TaskDescription
        description="Test description"
        slug="convert-to-rhel-conversion"
      />
    );

    screen.getByText(/test description/i);
  });

  it('shows quickstart button for known slug', () => {
    render(
      <TaskDescription
        description="Test description"
        slug="convert-to-rhel-conversion"
      />
    );

    screen.getByRole('button', {
      name: /help me get started/i,
    });
  });

  it('does not show quickstart button for other slugs', () => {
    render(<TaskDescription description="Test description" slug="123" />);

    expect(
      screen.queryByRole('button', {
        name: /help me get started/i,
      })
    ).not.toBeInTheDocument();
  });

  it('shows playbook preview download button', () => {
    render(<TaskDescription description="Test description" slug="123" />);

    expect(
      screen.getByRole('link', {
        name: /download preview of playbook/i,
      })
    ).toHaveAttribute('href', '/api/tasks/v1/task/123/playbook');
  });
});
