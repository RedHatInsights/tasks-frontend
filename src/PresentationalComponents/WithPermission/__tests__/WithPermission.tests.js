import React from 'react';
import { render, screen } from '@testing-library/react';
import WithPermission from '../WithPermission';

jest.mock('../../../Utilities/usePermissionCheck', () => ({
  useRbacV1Permissions: jest.fn(),
  useKesselPermissions: jest.fn(),
}));

jest.mock('../../../Utilities/useFeatureFlag', () => jest.fn());

jest.mock('../../../constants', () => ({
  KESSEL_RELATIONS: {
    tasksView: 'tasks_task_view',
    tasksEdit: 'tasks_task_edit',
  },
}));

const {
  useRbacV1Permissions,
  useKesselPermissions,
} = require('../../../Utilities/usePermissionCheck');
const useFeatureFlag = require('../../../Utilities/useFeatureFlag');

describe('WithPermission', () => {
  const props = {
    requiredPermissions: ['tasks:*:*'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render child with permissions (RBAC)', () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByLabelText('child')).toBeInTheDocument();
  });

  it('should not render child without permissions', () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should wait to render on loading permissions', () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: true,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with no required permissions', () => {
    props.requiredPermissions = undefined;
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render child with permissions when Kessel is enabled', () => {
    props.requiredPermissions = ['tasks:*:*'];
    useFeatureFlag.mockReturnValue(true); // Kessel enabled
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: true, // Kessel grants access
      isLoading: false,
    });

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByLabelText('child')).toBeInTheDocument();
  });

  it('should not render child without Kessel permissions when enabled', () => {
    useFeatureFlag.mockReturnValue(true); // Kessel enabled
    useRbacV1Permissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false, // Kessel denies access
      isLoading: false,
    });

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.queryByLabelText('child')).not.toBeInTheDocument();
  });

  it('should wait while Kessel is loading when enabled', () => {
    useFeatureFlag.mockReturnValue(true); // Kessel enabled
    useRbacV1Permissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: true, // Kessel is loading
    });

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.queryByLabelText('child')).not.toBeInTheDocument();
  });

  it('should only call the appropriate hook based on feature flag', () => {
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
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    // Only RBAC hook should be called when feature flag is disabled
    expect(useRbacV1Permissions).toHaveBeenCalledWith('tasks', ['tasks:*:*']);
    expect(useKesselPermissions).not.toHaveBeenCalled();
  });

  it('should use RBAC result when feature flag is disabled', () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: true, // RBAC grants access
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false, // Kessel denies access
      isLoading: false,
    });

    render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    // Should render because RBAC grants access (flag is disabled)
    expect(screen.getByLabelText('child')).toBeInTheDocument();
  });

  it('should use Kessel result when feature flag is enabled', () => {
    useFeatureFlag.mockReturnValue(true);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: true, // RBAC grants access
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: false, // Kessel denies access
      isLoading: false,
    });

    render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    // Should NOT render because Kessel denies access (flag is enabled)
    expect(screen.queryByLabelText('child')).not.toBeInTheDocument();
  });

  it('should call useKesselPermissions with correct relations when Kessel enabled', () => {
    useFeatureFlag.mockReturnValue(true);
    useKesselPermissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });

    render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    // Should call with both tasksView and tasksEdit relations
    expect(useKesselPermissions).toHaveBeenCalledWith([
      'tasks_task_view',
      'tasks_task_edit',
    ]);
  });

  it('should render empty string while RBAC is loading', () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: true,
    });

    const { container } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render empty string while Kessel is loading', () => {
    useFeatureFlag.mockReturnValue(true);
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: true,
    });

    const { container } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render NotAuthorized when RBAC denies access', () => {
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(screen.queryByLabelText('child')).not.toBeInTheDocument();
    expect(
      screen.getByText(/Contact your organization administrator/i)
    ).toBeInTheDocument();
  });

  it('should render NotAuthorized when Kessel denies access', () => {
    useFeatureFlag.mockReturnValue(true);
    useKesselPermissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(screen.queryByLabelText('child')).not.toBeInTheDocument();
    expect(
      screen.getByText(/Contact your organization administrator/i)
    ).toBeInTheDocument();
  });
});
