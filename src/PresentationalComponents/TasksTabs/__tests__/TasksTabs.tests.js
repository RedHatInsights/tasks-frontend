import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TasksTabs from '../TasksTabs';
import { TASKS_PAGE_TABS } from '../../../constants';

describe('TasksTabs', () => {
  let props;

  beforeEach(() => {
    props = {
      className: 'tabs-background',
      tabIndex: 0,
      tabsList: TASKS_PAGE_TABS,
      updateTab: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { asFragment } = render(<TasksTabs {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should update tab index', async () => {
    render(<TasksTabs {...props} />);

    userEvent.click(screen.getByText('Completed tasks'));
    await waitFor(() =>
      expect(props.updateTab).toHaveBeenCalledWith(expect.anything(), 1)
    );
  });
});
