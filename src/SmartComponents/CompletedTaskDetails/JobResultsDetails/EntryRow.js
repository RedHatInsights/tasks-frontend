import React from 'react';
import propTypes from 'prop-types';
import severityMap from '../TaskEntries';
import { Icon } from '@patternfly/react-core';

const EntryRow = ({ severity, taskConstantMapper, title }) => {
  const mappedSeverity =
    severityMap[taskConstantMapper][severity.toLowerCase()];
  const renderIcon = () => {
    return (
      <Icon
        status={mappedSeverity['iconSeverityColor']}
        style={{ marginRight: '8px' }}
      >
        {mappedSeverity['icon']}
      </Icon>
    );
  };

  const renderTitle = () => {
    return (
      <span
        style={{
          color: mappedSeverity['titleColor'],
        }}
      >
        <strong>{title}</strong>
      </span>
    );
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
  taskConstantMapper: propTypes.string,
  title: propTypes.string,
};

export default EntryRow;
