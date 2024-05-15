import React from 'react';
import propTypes from 'prop-types';
import SystemsSelect from './SystemsSelect';
import InputParameters from './InputParameters';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { INFO_ALERT_SYSTEMS, TASK_ERROR } from '../../constants';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import { TaskDescription } from './TaskDescription';
import { TaskName } from './TaskName';
import { Alert, Flex } from '@patternfly/react-core';
import warningConstants from '../warningConstants';

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
  const warningConstantMapper = `${slug
    ?.toUpperCase()
    .replace(/-/g, '_')}_WARNING`;

  return error ? (
    <EmptyStateDisplay
      icon={ExclamationCircleIcon}
      color="#c9190b"
      title={'This task cannot be displayed'}
      text={TASK_ERROR}
      error={`Error ${error?.response?.status}: ${error?.message}`}
    />
  ) : !areSystemsSelected ? (
    <Flex
      direction={{ default: 'column' }}
      spaceItems={{ default: 'spaceItemsLg' }}
    >
      <TaskDescription slug={slug} description={description} />
      <TaskName
        taskName={taskName}
        setTaskName={setTaskName}
        createTaskError={createTaskError}
      />
      <div id="task-warnings-and-alerts" aria-label="Task warnings and alerts">
        {warningConstants[warningConstantMapper]}
        <Alert variant="info" isInline title="Only eligible systems are shown">
          {filterMessage || INFO_ALERT_SYSTEMS}
        </Alert>
      </div>
      <SystemsSelect
        createTaskError={createTaskError}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        slug={slug}
        filterMessage={filterMessage}
      />
    </Flex>
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
