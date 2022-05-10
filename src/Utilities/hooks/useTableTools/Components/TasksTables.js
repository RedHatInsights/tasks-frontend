import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';
import useTableTools from '../useTableTools';

const TasksTables = ({
  label,
  ouiaId,
  items = [],
  columns = [],
  filters = [],
  options = {},
  //toolbarProps: toolbarPropsProp,
  //...tablePropsRest
}) => {
  const { toolbarProps, tableProps } = useTableTools(items, columns, {
    filters,
    ...options,
  });

  return (
    <React.Fragment>
      <PrimaryToolbar {...toolbarProps} />

      <Table
        aria-label={label}
        ouiaId={ouiaId}
        /*rows={rows}
        cells={columns}*/
        {...tableProps}
      >
        <TableHeader />
        <TableBody />
      </Table>

      {/* The -1 are to combat a bug currently in the TableToolbar component */}
      <TableToolbar isFooter results={-1} selected={-1}>
        <Pagination
          variant={PaginationVariant.bottom}
          /*{...toolbarProps.pagination}*/
        />
      </TableToolbar>

      {/*ColumnManager && <ColumnManager />*/}
    </React.Fragment>
  );
};

TasksTables.propTypes = {
  label: propTypes.string,
  ouiaId: propTypes.string,
  items: propTypes.array.isRequired,
  /*columns: propTypes.arrayOf(
    propTypes.shape({
      title: propTypes.node,
      transforms: propTypes.array,
      sortByProperty: propTypes.string,
      sortByFunction: propTypes.func,
      renderFunc: propTypes.func,
    })
  ).isRequired,*/
  columns: propTypes.array.isRequired,
  filters: propTypes.object,
  options: propTypes.object,
  toolbarProps: propTypes.object,
};

export default TasksTables;
