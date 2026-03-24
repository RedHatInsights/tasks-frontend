import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';

import CompletedTaskDetails from '../CompletedTaskDetails';
import { fetchExecutedTask, fetchExecutedTaskJobs } from '../../../../api';
import {
  log4j_task,
  log4j_task_jobs,
} from './__fixtures__/completedTasksDetails.fixtures';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';

jest.mock('../../../../api');
jest.mock('@redhat-cloud-services/frontend-components-notifications', () => ({
  useAddNotification: jest.fn(),
}));

jest.mock('../../../Utilities/usePermissionCheck', () => ({
  useRbacV1Permissions: jest.fn(),
  useKesselPermissions: jest.fn(),
}));

jest.mock('../../../Utilities/useFeatureFlag', () => jest.fn());

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate'
);

const {
  useRbacV1Permissions,
  useKesselPermissions,
} = require('../../../Utilities/usePermissionCheck');
const useFeatureFlag = require('../../../Utilities/useFeatureFlag');

describe('CompletedTaskDetails - Permission Checking with Feature Flag', () => {
  const store = init().getStore();
  const mockAddNotification = jest.fn();
  const navigateMock = jest.fn(() => ({}));

  beforeEach(() => {
    useAddNotification.mockReturnValue(mockAddNotification);
    useInsightsNavigate.mockImplementation(() => navigateMock);

    fetchExecutedTask.mockResolvedValue(log4j_task);
    fetchExecutedTaskJobs.mockResolvedValue({ data: log4j_task_jobs });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use RBAC permissions when Kessel is disabled', async () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());

    // Should call RBAC permissions with correct params
    expect(useRbacV1Permissions).toHaveBeenCalledWith('inventory', [
      'inventory:hosts:*',
      'inventory:hosts:read',
    ]);

    // Only RBAC hook should be called when feature flag is disabled
    expect(useKesselPermissions).not.toHaveBeenCalled();
  });

  it('should use Kessel permissions when enabled', async () => {
    useFeatureFlag.mockReturnValue(true);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());

    // Only Kessel hook should be called when feature flag is enabled
    expect(useKesselPermissions).toHaveBeenCalled();
    expect(useRbacV1Permissions).not.toHaveBeenCalled();

    // Feature flag should be checked
    expect(useFeatureFlag).toHaveBeenCalledWith('tasks.kessel_enabled');
  });

  it('should show NotAuthorized when RBAC denies access', async () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());

    // Should NOT show jobs table when RBAC denies access
    await waitFor(() => {
      expect(
        screen.queryByLabelText('216-completed-jobs')
      ).not.toBeInTheDocument();
    });
  });

  it('should show NotAuthorized when Kessel denies access', async () => {
    useFeatureFlag.mockReturnValue(true);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());

    // Should NOT show jobs table when Kessel denies access
    await waitFor(() => {
      expect(
        screen.queryByLabelText('216-completed-jobs')
      ).not.toBeInTheDocument();
    });
  });

  it('should only call the appropriate hook based on feature flag', async () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());

    // Only RBAC hook should be called when feature flag is disabled
    expect(useRbacV1Permissions).toHaveBeenCalled();
    expect(useKesselPermissions).not.toHaveBeenCalled();
  });

  it('should handle loading state from permissions', async () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: true,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());

    // Should NOT show jobs table while permissions are loading
    expect(
      screen.queryByLabelText('216-completed-jobs')
    ).not.toBeInTheDocument();
  });
});
