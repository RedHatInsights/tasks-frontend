import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import WithPermission from '../WithPermission';

jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook');

describe('WithPermission', () => {
  const props = {
    requiredPermissions: ['tasks:*:*'],
  };

  it('should render child with permissions', () => {
    usePermissions.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByLabelText('child')).toBeInTheDocument();
  });

  it('should not render child without permissions', () => {
    usePermissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should wait to render on loading permissions', () => {
    usePermissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: true,
    }));

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with no required permissions', () => {
    props.requiredPermissions = undefined;
    usePermissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));

    const { asFragment } = render(
      <WithPermission {...props}>
        <div aria-label="child"></div>
      </WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
