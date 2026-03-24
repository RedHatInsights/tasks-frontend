import { useState, useEffect } from 'react';
import { useAxiosWithPlatformInterceptors } from '@redhat-cloud-services/frontend-components-utilities/interceptors';

/**
 * Hook to fetch the default workspace ID from RBAC API.
 * Fetches the workspace once on mount and caches the result.
 *
 * @returns {{workspaceId: string|null, isLoading: boolean, error: Error|null}} Workspace fetch result
 */
export const useDefaultWorkspace = () => {
  const axios = useAxiosWithPlatformInterceptors();
  const [workspaceId, setWorkspaceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchDefaultWorkspaceId = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/rbac/v2/workspaces/', {
          params: {
            limit: 1,
            type: 'default',
          },
        });

        if (!isCancelled) {
          const defaultWorkspaceId = data?.data?.[0]?.id || null;
          setWorkspaceId(defaultWorkspaceId);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to fetch default workspace:', err);
          setError(err);
          setWorkspaceId(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchDefaultWorkspaceId();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { workspaceId, isLoading, error };
};
