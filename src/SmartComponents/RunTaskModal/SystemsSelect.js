import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import {
  Alert,
  Flex,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Text,
  TextContent,
  TextInput,
  Title,
} from '@patternfly/react-core';
import SystemTable from '../SystemTable/SystemTable';
import {
  AVAILABLE_TASKS_ROOT,
  INFO_ALERT_SYSTEMS,
  TASKS_API_ROOT,
} from '../../constants';
import ReactMarkdown from 'react-markdown';
import warningConstants from '../warningConstants';
import { useSystemBulkSelect } from './hooks/useBulkSystemSelect';

const SystemsSelect = ({
  createTaskError,
  description,
  selectedIds,
  setSelectedIds,
  setTaskName,
  slug,
  taskName,
  filterMessage,
}) => {
  const warningConstantMapper = `${slug
    ?.toUpperCase()
    .replace(/-/g, '_')}_WARNING`;

  const [filterSortString, setFilterSortString] = useState('');
  const [validated, setValidated] = useState('default');
  const [helperText, setHelperText] = useState(null);

  const handleSetTaskName = (_event, name) => {
    setTaskName(name);
  };

  useEffect(() => {
    if (createTaskError.status) {
      setHelperText(createTaskError.statusText);
      setValidated('error');
    }
  }, [createTaskError]);

  const { bulkSelectIds, selectIds } = useSystemBulkSelect(
    selectedIds,
    setSelectedIds,
    filterSortString,
    slug
  );

  return (
    <Flex
      direction={{ default: 'column' }}
      spaceItems={{ default: 'spaceItemsLg' }}
    >
      <TextContent>
        <Text component="h4">Task description</Text>
        <Text>
          <ReactMarkdown>{description}</ReactMarkdown>
        </Text>
        <Text>
          <a href={`${TASKS_API_ROOT}${AVAILABLE_TASKS_ROOT}/${slug}/playbook`}>
            Download preview of playbook
          </a>
        </Text>
      </TextContent>
      <Form>
        <FormGroup label="Task name" isRequired type="text" fieldId="name">
          <TextInput
            value={taskName}
            type="text"
            onChange={handleSetTaskName}
            aria-label="Edit task name text field"
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem variant={validated}>{helperText}</HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      </Form>
      <div id="task-warnings-and-alerts" aria-label="Task warnings and alerts">
        {warningConstants[warningConstantMapper]}
        <Alert variant="info" isInline title="Only eligible systems are shown">
          {filterMessage || INFO_ALERT_SYSTEMS}
        </Alert>
      </div>
      <Title headingLevel="h4">Systems to run tasks on</Title>
      <SystemTable
        bulkSelectIds={bulkSelectIds}
        selectedIds={selectedIds}
        selectIds={selectIds}
        setFilterSortString={setFilterSortString}
        slug={slug}
      />
    </Flex>
  );
};

SystemsSelect.propTypes = {
  createTaskError: propTypes.object,
  description: propTypes.any,
  selectedIds: propTypes.array,
  setSelectedIds: propTypes.func,
  setTaskName: propTypes.func,
  slug: propTypes.string,
  taskName: propTypes.string,
  filterMessage: propTypes.string,
};

export default SystemsSelect;
