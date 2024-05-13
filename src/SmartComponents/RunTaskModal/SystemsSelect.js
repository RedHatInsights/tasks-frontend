import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import {
  Alert,
  Button,
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
import { DownloadIcon } from '@patternfly/react-icons';
import {
  QuickstartButton,
  SLUG_TO_QUICKSTART,
} from '../AvailableTasks/QuickstartButton';

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

  useEffect(() => {
    if (taskName.trim().length === 0) {
      setHelperText('Task name cannot be empty');
      setValidated('error');
    } else if (validated === 'error') {
      setHelperText(null);
      setValidated('default');
    }
  }, [taskName]);

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
          <Button
            variant="link"
            component="a"
            href={`${TASKS_API_ROOT}${AVAILABLE_TASKS_ROOT}/${slug}/playbook`}
            icon={<DownloadIcon />}
            iconPosition="end"
            isInline
          >
            Download preview of playbook
          </Button>
          {Object.keys(SLUG_TO_QUICKSTART).includes(slug) && (
            <QuickstartButton slug={slug} />
          )}
        </Text>
      </TextContent>
      <Form>
        <FormGroup label="Task name" isRequired type="text" fieldId="name">
          <TextInput
            value={taskName}
            type="text"
            onChange={handleSetTaskName}
            aria-label="Edit task name text field"
            validated={validated}
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
