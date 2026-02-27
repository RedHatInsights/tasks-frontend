import { renderHook, waitFor } from '@testing-library/react';
import { useDefaultWorkspace } from '../useDefaultWorkspace';
import { useAxiosWithPlatformInterceptors } from '@redhat-cloud-services/frontend-components-utilities/interceptors';

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/interceptors',
  () => ({
    useAxiosWithPlatformInterceptors: jest.fn(),
  })
);

describe('useDefaultWorkspace', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = {
      get: jest.fn(),
    };
    useAxiosWithPlatformInterceptors.mockReturnValue(mockAxios);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch default workspace successfully', async () => {
    const mockWorkspaceId = 'workspace-123';
    mockAxios.get.mockResolvedValue({
      data: [{ id: mockWorkspaceId, type: 'default' }],
    });

    const { result } = renderHook(() => useDefaultWorkspace());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(mockWorkspaceId);
    expect(result.current.error).toBe(null);
    expect(mockAxios.get).toHaveBeenCalledWith('/api/rbac/v2/workspaces/', {
      params: {
        limit: 1,
        type: 'default',
      },
    });
  });

  it('should handle empty workspace response', async () => {
    mockAxios.get.mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should handle workspace fetch error', async () => {
    const mockError = new Error('Network error');
    mockAxios.get.mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(null);
    expect(result.current.error).toBe(mockError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch default workspace:',
      mockError
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle undefined workspace data', async () => {
    mockAxios.get.mockResolvedValue({
      data: undefined,
    });

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should handle malformed workspace response', async () => {
    mockAxios.get.mockResolvedValue({
      data: [{ name: 'test' }], // missing id
    });

    const { result } = renderHook(() => useDefaultWorkspace());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.workspaceId).toBe(null);
    expect(result.current.error).toBe(null);
  });
});
