import React from 'react';
import propTypes from 'prop-types';
import severityMap from '../TaskEntries';
import EntryRowLabel from './EntryRowLabel';
import { t_global_spacer_xs } from '@patternfly/react-tokens';

const EntryRow = ({ severity, taskConstantMapper, title }) => {
  const mappedSeverity =
    severityMap[taskConstantMapper][severity.toLowerCase()];

  return (
    <React.Fragment>
      <span style={{ color: mappedSeverity['titleColor'], fontWeight: 'bold' }}>
        {title}
      </span>
      <div
        style={{
          marginTop: t_global_spacer_xs.value,
          marginBottom: t_global_spacer_xs.value,
        }}
      >
        <EntryRowLabel
          color={mappedSeverity['severityColor']}
          icon={mappedSeverity['icon']}
          text={mappedSeverity['text']}
        />
      </div>
    </React.Fragment>
  );
};

EntryRow.propTypes = {
  severity: propTypes.string,
  taskConstantMapper: propTypes.string,
  title: propTypes.string,
};

export default EntryRow;
