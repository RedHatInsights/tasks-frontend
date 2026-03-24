import { renderHook, waitFor } from '@testing-library/react';
import { useDefaultWorkspace } from '../useDefaultWorkspace';

const mockAxiosGet = jest.fn();

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/interceptors',
  () => ({
    useAxiosWithPlatformInterceptors: () => ({
      get: mockAxiosGet,
    }),
  })
);

describe('useDefaultWorkspace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  it('should fetch default workspace successfully', async () => {
    const mockWorkspaceId = 'workspace-123';
    const mockResponse = {
      data: [
        {
          id: mockWorkspaceId,
          type: 'default',
          name: 'Default Workspace',
          created: '2024-01-01',
          modified: '2024-01-01',
        },
      ],
    };
    mockAxiosGet.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDefaultWorkspace());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(mockWorkspaceId);
    expect(result.current.error).toBe(null);
    expect(mockAxiosGet).toHaveBeenCalledWith('/api/rbac/v2/workspaces/', {
      params: { limit: 1, type: 'default' },
    });
  });

  it('should handle null workspace response', async () => {
    mockAxiosGet.mockResolvedValue({ data: { data: null } });

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should handle workspace fetch error', async () => {
    const mockError = new Error('Network error');
    mockAxiosGet.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(null);
    expect(result.current.error).toBe(mockError);
  });

  it('should handle undefined workspace data', async () => {
    mockAxiosGet.mockResolvedValue({ data: { data: undefined } });

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should handle malformed workspace response', async () => {
    mockAxiosGet.mockResolvedValue({ data: { data: [{ name: 'test' }] } });

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should handle empty workspace array', async () => {
    mockAxiosGet.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(null);
    expect(result.current.error).toBe(null);
  });
});
