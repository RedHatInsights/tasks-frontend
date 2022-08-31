import React from 'react';
import propTypes from 'prop-types';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';

const WithPermission = ({ children, requiredPermissions = [] }) => {
  const { hasAccess, isLoading } = usePermissions('tasks', requiredPermissions);

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
