import React from 'react';
import propTypes from 'prop-types';
import severityMap from '../TaskEntries';

const EntryRow = ({ severity, taskConstantMapper, title }) => {
  const renderIcon = () => {
    return (
      <span style={{ marginRight: '8px' }}>
        {severityMap[taskConstantMapper][severity.toLowerCase()]['icon']}
      </span>
    );
  };

  const renderTitle = () => {
    return (
      <span
        style={{
          color:
            severityMap[taskConstantMapper][severity.toLowerCase()][
              'titleColor'
            ],
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
