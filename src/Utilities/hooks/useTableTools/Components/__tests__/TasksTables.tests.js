import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import TasksTables from '../TasksTables';
import { emptyRows } from '../../../../../PresentationalComponents/NoResultsTable/NoResultsTable';
import { activityTableItems } from './TasksTable.fixtures';
import columns from '../../../../../SmartComponents/ActivityTable/Columns';

describe('TasksTables', () => {
  let props;

  beforeEach(() => {
    props = {
      label: 'table',
      ouiaId: 'ouia-table',
      items: activityTableItems.data,
      columns: columns,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TasksTables {...props} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  // This test will be updated in future PR with empty state
  it('should render empty', () => {
    props.items = [];
    props.emptyRows = emptyRows('items');
    const { asFragment } = render(
      <MemoryRouter>
        <TasksTables {...props} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
