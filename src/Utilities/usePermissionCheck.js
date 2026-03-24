import { useMemo } from 'react';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { getKesselAccessCheckParams } from '@redhat-cloud-services/frontend-components-utilities/kesselPermissions';
import { usePermissions as useRbacPermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { useDefaultWorkspace } from './useDefaultWorkspace';

/**
 * Hook for checking permissions using RBAC v1 (traditional approach).
 *
 * @param {string} appName - The application name (e.g., 'tasks', 'inventory')
 * @param {string[]} requiredPermissions - Array of permission strings in format 'application:resource:action'
 * @returns {{hasAccess: boolean, isLoading: boolean}} Permission check result
 */
export const useRbacV1Permissions = (appName, requiredPermissions) => {
  const { hasAccess, isLoading } = useRbacPermissions(
    appName,
    requiredPermissions
  );

  return { hasAccess, isLoading };
};

/**
 * Hook for checking permissions using Kessel (workspace-aware approach).
 *
 * @param {string[]} kesselRelations - Array of Kessel relation strings in format 'application_resource_action'
 * @returns {{hasAccess: boolean, isLoading: boolean}} Permission check result
 */
export const useKesselPermissions = (kesselRelations) => {
  const {
    workspaceId,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useDefaultWorkspace();

  const kesselRelationsKey = JSON.stringify(kesselRelations);

  const params = useMemo(() => {
    return workspaceId
      ? getKesselAccessCheckParams({
          requiredPermissions: kesselRelations,
          resourceIdOrIds: workspaceId,
          options: {
            resourceType: 'workspace',
            reporter: { type: 'rbac' },
          },
        })
      : { resources: [] };
  }, [workspaceId, kesselRelationsKey]);

  const { data, loading, error } = useSelfAccessCheck(params);

  if (workspaceLoading) {
    return { hasAccess: false, isLoading: true };
  }

  if (params?.resources?.length === 0) {
    return { hasAccess: true, isLoading: false };
  }

  if (!workspaceId || workspaceError) {
    return { hasAccess: false, isLoading: false };
  }

  if (error) {
    return { hasAccess: false, isLoading: false };
  }

  const hasAccess = Array.isArray(data)
    ? data.every((check) => check?.allowed === true)
    : data?.allowed ?? false;

  return { hasAccess, isLoading: loading };
};
