import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import {
  useRbacV1Permissions,
  useKesselPermissions,
} from '../../Utilities/usePermissionCheck';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { KESSEL_RELATIONS } from '../../constants';
import useFeatureFlag from '../../Utilities/useFeatureFlag';

const WithRbacV1Permission = ({ requiredPermissions, children }) => {
  const { hasAccess, isLoading } = useRbacV1Permissions(
    'tasks',
    requiredPermissions
  );

  if (isLoading) {
    return '';
  }

  return hasAccess ? children : <NotAuthorized serviceName="Tasks" />;
};

WithRbacV1Permission.propTypes = {
  requiredPermissions: propTypes.array,
  children: propTypes.node,
};

const WithKesselPermission = ({ requiredPermissions, children }) => {
  const kesselRelations = useMemo(
    () => [KESSEL_RELATIONS.tasksView, KESSEL_RELATIONS.tasksEdit],
    [requiredPermissions?.length]
  );

  const { hasAccess, isLoading } = useKesselPermissions(kesselRelations);

  if (isLoading) {
    return '';
  }

  return hasAccess ? children : <NotAuthorized serviceName="Tasks" />;
};

WithKesselPermission.propTypes = {
  requiredPermissions: propTypes.array,
  children: propTypes.node,
};

const WithPermission = ({ children, requiredPermissions = [] }) => {
  const isKesselEnabled = useFeatureFlag('tasks.kessel_enabled');

  return isKesselEnabled ? (
    <WithKesselPermission requiredPermissions={requiredPermissions}>
      {children}
    </WithKesselPermission>
  ) : (
    <WithRbacV1Permission requiredPermissions={requiredPermissions}>
      {children}
    </WithRbacV1Permission>
  );
};

WithPermission.propTypes = {
  children: propTypes.node,
  requiredPermissions: propTypes.array,
};

export default WithPermission;
