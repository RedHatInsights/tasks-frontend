import React from 'react';
import propTypes from 'prop-types';
import SystemsSelect from './SystemsSelect';
import InputParameters from './InputParameters';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { TASK_ERROR } from '../../constants';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';

const RunTaskModalBody = ({
  areSystemsSelected,
  createTaskError,
  description,
  error,
  parameters,
  selectedIds,
  setDefinedParameters,
  setSelectedIds,
  setTaskName,
  slug,
  taskName,
  filterMessage,
}) => {
  return error ? (
    <EmptyStateDisplay
      icon={ExclamationCircleIcon}
      color="#c9190b"
      title={'This task cannot be displayed'}
      text={TASK_ERROR}
      error={`Error ${error?.response?.status}: ${error?.message}`}
    />
  ) : !areSystemsSelected ? (
    <SystemsSelect
      createTaskError={createTaskError}
      description={description}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      setTaskName={setTaskName}
      slug={slug}
      taskName={taskName}
      filterMessage={filterMessage}
    />
  ) : (
    <InputParameters
      parameters={parameters}
      setDefinedParameters={setDefinedParameters}
    />
  );
};

RunTaskModalBody.propTypes = {
  areSystemsSelected: propTypes.bool,
  createTaskError: propTypes.object,
  description: propTypes.oneOfType([propTypes.string, propTypes.node]),
  error: propTypes.object,
  parameters: propTypes.array,
  selectedIds: propTypes.array,
  setDefinedParameters: propTypes.func,
  setSelectedIds: propTypes.func,
  setTaskName: propTypes.func,
  slug: propTypes.string,
  taskName: propTypes.string,
  filterMessage: propTypes.string,
};

export default RunTaskModalBody;
