import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { getKesselAccessCheckParams } from '@redhat-cloud-services/frontend-components-utilities/kesselPermissions';
import { usePermissions as useRbacPermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { useDefaultWorkspace } from './useDefaultWorkspace';

/**
 * Hook for checking permissions using RBAC v1 (traditional approach)
 * @param {string} appName - The application name (e.g., 'tasks', 'inventory')
 * @param {Array<string>} requiredPermissions - Array of permission strings
 * @returns {Object} - { hasAccess: boolean, isLoading: boolean }
 */
export const useRbacV1Permissions = (appName, requiredPermissions) => {
  const { hasAccess, isLoading } = useRbacPermissions(
    appName,
    requiredPermissions
  );

  return { hasAccess, isLoading };
};

/**
 * Hook for checking permissions using Kessel (workspace-aware)
 * @param {Array<string>} kesselRelations - Array of Kessel relation strings (e.g., ['view'])
 * @returns {Object} - { hasAccess: boolean, isLoading: boolean }
 */
export const useKesselPermissions = (kesselRelations) => {
  const { workspaceId, isLoading: workspaceLoading } = useDefaultWorkspace();

  const params = getKesselAccessCheckParams({
    requiredPermissions: kesselRelations,
    resourceIdOrIds: workspaceId,
    options: {
      resourceType: 'workspace',
      reporter: { type: 'rbac' },
    },
  });

  const { data, loading, error } = useSelfAccessCheck(params);

  if (workspaceLoading) {
    return { hasAccess: false, isLoading: true };
  }

  if (!workspaceId || error) {
    return { hasAccess: false, isLoading: false };
  }

  const hasAccess = data?.some((result) => result?.allowed === true) ?? false;

  return { hasAccess, isLoading: loading };
};
