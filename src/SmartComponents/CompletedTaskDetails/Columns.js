import React from 'react';
import propTypes from 'prop-types';
import { renderColumnComponent } from '../../Utilities/helpers';
import SplitMessages from '../../PresentationalComponents/SplitMessages/SplitMessages';
import { createSystemLink } from '../../helpers';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const SystemNameCell = ({ system, display_name }, index) => {
  const chrome = useChrome();

  if (display_name) {
    return createSystemLink(
      system,
      display_name,
      `system-title-${index}`,
      chrome?.isBeta?.()
    );
  } else {
    return <span style={{ color: '#72767B' }}>System deleted</span>;
  }
};

SystemNameCell.propTypes = {
  system: propTypes.string,
  display_name: propTypes.node,
};

export const SystemColumn = {
  title: 'System name',
  props: {
    width: 30,
  },
  sortByProp: 'display_name',
  renderExport: (job) => job.display_name || 'System deleted',
  renderFunc: renderColumnComponent(SystemNameCell),
};

export const StatusColumn = {
  title: 'Status',
  props: {
    width: 10,
  },
  sortByProp: 'status',
  renderExport: (job) => job.status,
};

export const MessageColumn = {
  title: 'Message',
  props: {
    width: 35,
  },
  sortByFunction: (job) => job.results.message,
  renderExport: (job) => job.results.message,
  renderFunc: (_, _empty, job) => (
    <SplitMessages
      content={job.results.message}
      alert={
        job.results.alert ||
        job.status === 'Failure' ||
        job.status === 'Timeout'
      }
    />
  ),
};

export const exportableColumns = [SystemColumn, StatusColumn, MessageColumn];

export default [SystemColumn, StatusColumn, MessageColumn];
