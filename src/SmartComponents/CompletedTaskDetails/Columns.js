import React from 'react';
import propTypes from 'prop-types';
import { renderColumnComponent } from '../../Utilities/helpers';

const SystemNameCell = ({ system, display_name }, index) => (
  <a key={`system-title-${index}`} href={`/insights/inventory/${system}`}>
    {display_name}
  </a>
);

SystemNameCell.propTypes = {
  system: propTypes.string,
  display_name: propTypes.node,
};

export const SystemColumn = {
  title: 'System name',
  props: {
    width: 35,
  },
  sortByProp: 'display_name',
  renderExport: (job) => job.display_name,
  renderFunc: renderColumnComponent(SystemNameCell),
};

export const ResultColumn = {
  title: 'Result',
  props: {
    width: 20,
  },
  sortByProp: 'status',
  renderExport: (job) => job.status,
};

export const MessageColumn = {
  title: 'Message',
  props: {
    width: 20,
  },
  sortByProp: 'message',
  renderExport: (job) => job.message,
};

export const exportableColumns = [SystemColumn, ResultColumn, MessageColumn];

export default [SystemColumn, ResultColumn, MessageColumn];
