import React from 'react';
import propTypes from 'prop-types';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';

const EntryRow = ({ severity, title }) => {
  const renderIcon = () => {
    if (severity === 'Info') {
      return (
        <span style={{ marginRight: '8px' }}>
          <InfoCircleIcon color="#2B9AF3" />
        </span>
      );
    } else if (severity === 'Warning') {
      return (
        <span style={{ marginRight: '8px' }}>
          <ExclamationTriangleIcon color="#F0AB00" />
        </span>
      );
    } else if (severity === 'Error') {
      return (
        <span style={{ marginRight: '8px' }}>
          <ExclamationCircleIcon color="#C9190B" />

        </span>
      );
    }
  };

  const renderTitle = () => {
    if (severity === 'Info') {
      return (
        <span style={{ color: '#002952' }}>
          <strong>{title}</strong>
        </span>
      );
    } else if (severity === 'Warning') {
      return (
        <span style={{ color: '#795000' }}>
          <strong>{title}</strong>
        </span>
      );
    } else if (severity === 'Error') {
      return (
        <span style={{ color: '#A30000' }}>
          <strong>{title}</strong>
        </span>
      );
    }
  };

  return (
    <span>
      {renderIcon()}
      {renderTitle()}
    </span>
  );
};

EntryRow.propTypes = {
  severity: propTypes.string,
  title: propTypes.string,
};

export default EntryRow;
