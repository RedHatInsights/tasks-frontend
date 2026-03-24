import { renderHook, waitFor } from '@testing-library/react';
import {
  useDefaultWorkspace,
  resetWorkspaceCache,
} from '../useDefaultWorkspace';
import { fetchDefaultWorkspace } from '@project-kessel/react-kessel-access-check';

jest.mock('@project-kessel/react-kessel-access-check', () => ({
  fetchDefaultWorkspace: jest.fn(),
}));

describe('useDefaultWorkspace', () => {
  beforeEach(() => {
    resetWorkspaceCache();
    jest.clearAllMocks();
  });

  it('should fetch default workspace successfully', async () => {
    const mockWorkspaceId = 'workspace-123';
    const mockWorkspace = {
      id: mockWorkspaceId,
      type: 'default',
      name: 'Default Workspace',
      created: '2024-01-01',
      modified: '2024-01-01',
    };
    fetchDefaultWorkspace.mockResolvedValue(mockWorkspace);

    const { result } = renderHook(() => useDefaultWorkspace());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(mockWorkspaceId);
    expect(result.current.error).toBe(null);
    expect(fetchDefaultWorkspace).toHaveBeenCalledWith(window.location.origin);
  });

  it('should handle null workspace response', async () => {
    fetchDefaultWorkspace.mockResolvedValue(null);

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should handle workspace fetch error', async () => {
    const mockError = new Error('Network error');
    fetchDefaultWorkspace.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBeUndefined();
    expect(result.current.error).toBe(mockError);
  });

  it('should handle undefined workspace data', async () => {
    fetchDefaultWorkspace.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should handle malformed workspace response', async () => {
    const malformedWorkspace = { name: 'test' };
    fetchDefaultWorkspace.mockResolvedValue(malformedWorkspace);

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should cache the workspace promise to prevent duplicate API calls', async () => {
    const mockWorkspace = {
      id: 'workspace-123',
      type: 'default',
      name: 'Default Workspace',
      created: '2024-01-01',
      modified: '2024-01-01',
    };
    fetchDefaultWorkspace.mockResolvedValue(mockWorkspace);

    const { result: result1 } = renderHook(() => useDefaultWorkspace());
    const { result: result2 } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false);
    });

    await waitFor(() => {
      expect(result2.current.isLoading).toBe(false);
    });

    expect(fetchDefaultWorkspace).toHaveBeenCalledTimes(1);
    expect(result1.current.workspaceId).toBe('workspace-123');
    expect(result2.current.workspaceId).toBe('workspace-123');
  });
});
