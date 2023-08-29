import React from 'react';
import propTypes from 'prop-types';
import {severity_map} from '../TaskEntries';

// const task_slug = "Leapp"
const task_slug = "Convert2RHEL"
const EntryRow = ({ severity, title }) => {
  console.log(title, "title")
  const renderIcon = () => {
    return (
      <span style={{ marginRight: '8px' }}>
        {severity_map[task_slug][severity]["icon"]}
      </span>
    );
  };

  const renderTitle = () => {
      return (
        <span style={{color: severity_map[task_slug][severity]["color"]}}>
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
  title: propTypes.string,
};


export default EntryRow;
