import { renderHook } from '@testing-library/react';
import {
  useRbacV1Permissions,
  useKesselPermissions,
} from '../usePermissionCheck';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { getKesselAccessCheckParams } from '@redhat-cloud-services/frontend-components-utilities/kesselPermissions';
import { useDefaultWorkspace } from '../useDefaultWorkspace';

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/RBACHook',
  () => ({
    usePermissions: jest.fn(),
  }),
);

jest.mock('@project-kessel/react-kessel-access-check', () => ({
  useSelfAccessCheck: jest.fn(),
}));

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/kesselPermissions',
  () => ({
    getKesselAccessCheckParams: jest.fn(),
  }),
);

jest.mock('../useDefaultWorkspace', () => ({
  useDefaultWorkspace: jest.fn(),
}));

describe('useRbacV1Permissions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return hasAccess true when user has permissions', () => {
    usePermissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useRbacV1Permissions('tasks', ['tasks:*:*']),
    );

    expect(result.current.hasAccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(usePermissions).toHaveBeenCalledWith('tasks', ['tasks:*:*']);
  });

  it('should return hasAccess false when user lacks permissions', () => {
    usePermissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useRbacV1Permissions('tasks', ['tasks:*:*']),
    );

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return isLoading true while checking permissions', () => {
    usePermissions.mockReturnValue({
      hasAccess: false,
      isLoading: true,
    });

    const { result } = renderHook(() =>
      useRbacV1Permissions('tasks', ['tasks:*:*']),
    );

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('should work with inventory permissions', () => {
    usePermissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useRbacV1Permissions('inventory', [
        'inventory:hosts:*',
        'inventory:hosts:read',
      ]),
    );

    expect(result.current.hasAccess).toBe(true);
    expect(usePermissions).toHaveBeenCalledWith('inventory', [
      'inventory:hosts:*',
      'inventory:hosts:read',
    ]);
  });
});

describe('useKesselPermissions', () => {
  beforeEach(() => {
    getKesselAccessCheckParams.mockReturnValue({
      resources: [{ id: 'workspace-123', type: 'workspace' }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return hasAccess true when Kessel grants permission', async () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: 'workspace-123',
      isLoading: false,
      error: null,
    });

    useSelfAccessCheck.mockReturnValue({
      data: [{ allowed: true }],
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKesselPermissions(['view']));

    expect(result.current.hasAccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return hasAccess false when Kessel denies permission', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: 'workspace-123',
      isLoading: false,
      error: null,
    });

    useSelfAccessCheck.mockReturnValue({
      data: [{ allowed: false }, { allowed: false }],
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKesselPermissions(['view']));

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return isLoading true while workspace is loading', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: null,
      isLoading: true,
      error: null,
    });

    useSelfAccessCheck.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKesselPermissions(['view']));

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('should return hasAccess true when workspace is not available but resources empty', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: null,
      isLoading: false,
      error: null,
    });

    getKesselAccessCheckParams.mockReturnValue({
      resources: [],
    });

    useSelfAccessCheck.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKesselPermissions(['view']));

    expect(result.current.hasAccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return hasAccess false when Kessel returns error', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: 'workspace-123',
      isLoading: false,
      error: null,
    });

    useSelfAccessCheck.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Kessel error'),
    });

    const { result } = renderHook(() => useKesselPermissions(['view']));

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should call getKesselAccessCheckParams with correct parameters', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: 'workspace-123',
      isLoading: false,
      error: null,
    });

    useSelfAccessCheck.mockReturnValue({
      data: [{ allowed: true }],
      loading: false,
      error: null,
    });

    renderHook(() => useKesselPermissions(['view', 'edit']));

    expect(getKesselAccessCheckParams).toHaveBeenCalledWith({
      requiredPermissions: ['view', 'edit'],
      resourceIdOrIds: 'workspace-123',
      options: {
        resourceType: 'workspace',
        reporter: { type: 'rbac' },
      },
    });
  });

  it('should handle empty Kessel data response', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: 'workspace-123',
      isLoading: false,
      error: null,
    });

    useSelfAccessCheck.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKesselPermissions(['view']));

    expect(result.current.hasAccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return false if any permission is denied', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: 'workspace-123',
      isLoading: false,
      error: null,
    });

    useSelfAccessCheck.mockReturnValue({
      data: [{ allowed: true }, { allowed: false }, { allowed: true }],
      loading: false,
      error: null,
    });

    const { result } = renderHook(() =>
      useKesselPermissions(['view', 'edit', 'delete']),
    );

    expect(result.current.hasAccess).toBe(false);
  });

  it('should return isLoading true when Kessel is loading', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: 'workspace-123',
      isLoading: false,
      error: null,
    });

    useSelfAccessCheck.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const { result } = renderHook(() => useKesselPermissions(['view']));

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle workspace fetch error', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: 'workspace-123',
      isLoading: false,
      error: new Error('Workspace fetch failed'),
    });

    getKesselAccessCheckParams.mockReturnValue({
      resources: [{ id: 'workspace-123', type: 'workspace' }],
    });

    useSelfAccessCheck.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKesselPermissions(['view']));

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return hasAccess true when no resources to check', () => {
    useDefaultWorkspace.mockReturnValue({
      workspaceId: 'workspace-123',
      isLoading: false,
      error: null,
    });

    getKesselAccessCheckParams.mockReturnValue({
      resources: [],
    });

    useSelfAccessCheck.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKesselPermissions([]));

    expect(result.current.hasAccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });
});
