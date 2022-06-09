import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  TASKS_PAGE_POPOVER_HEADER,
  TASKS_PAGE_POPOVER_BODY,
  TASKS_PAGE_POPOVER_FOOTER,
} from '../../../constants';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

import TasksPopover from '../TasksPopover';

describe('TasksPopover', () => {
  let props;
  let mockStore = configureStore();

  beforeEach(() => {
    props = {
      body: TASKS_PAGE_POPOVER_BODY,
      content: <OutlinedQuestionCircleIcon />,
      footer: TASKS_PAGE_POPOVER_FOOTER,
      header: TASKS_PAGE_POPOVER_HEADER,
      label: 'test-aria-label',
    };
  });

  it('should render correctly', async () => {
    const store = mockStore(props);
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <TasksPopover {...props} />
        </Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
