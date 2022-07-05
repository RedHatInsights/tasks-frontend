import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { renderColumnComponent } from '../../Utilities/helpers';

const SystemNameCell = ({ /*id,*/ display_name }, index) => (
  <Link
    key={`system-title-${index}`}
    //to={`/executed/${id}`}
    to={`/`}
  >
    {display_name}
  </Link>
);

SystemNameCell.propTypes = {
  id: propTypes.string,
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
