import React from 'react';
import propTypes from 'prop-types';
import {
  useRbacV1Permissions,
  useKesselPermissions,
} from '../../Utilities/usePermissionCheck';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { KESSEL_RELATIONS } from '../../constants';
import useFeatureFlag from '../../Utilities/useFeatureFlag';

const WithPermission = ({ children, requiredPermissions = [] }) => {
  const isKesselEnabled = useFeatureFlag('tasks.kessel_enabled');

  const rbacResult = useRbacV1Permissions('tasks', requiredPermissions);
  const kesselResult = useKesselPermissions(
    requiredPermissions.map(() => KESSEL_RELATIONS.tasks)
  );

  const { hasAccess, isLoading } = isKesselEnabled ? kesselResult : rbacResult;

  if (!isLoading) {
    return hasAccess ? children : <NotAuthorized serviceName="Tasks" />;
  } else {
    return '';
  }
};

WithPermission.propTypes = {
  children: propTypes.node,
  requiredPermissions: propTypes.array,
};

export default WithPermission;
