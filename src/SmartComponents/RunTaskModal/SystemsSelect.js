import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import {
  Alert,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
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
    <React.Fragment>
      <Flex>
        <FlexItem>
          <b>Task description</b>
        </FlexItem>
      </Flex>
      <Flex style={{ paddingBottom: '8px' }}>
        <FlexItem style={{ width: '100%' }}>
          <ReactMarkdown>{description}</ReactMarkdown>
        </FlexItem>
      </Flex>
      <Flex>
        <FlexItem>
          <a href={`${TASKS_API_ROOT}${AVAILABLE_TASKS_ROOT}/${slug}/playbook`}>
            Download preview of playbook
          </a>
        </FlexItem>
      </Flex>
      <br />
      <div>
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
                <HelperTextItem variant={validated}>
                  {helperText}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        </Form>
      </div>
      <br />
      <div style={{ paddingBottom: '8px' }}>
        <b>Systems to run tasks on</b>
      </div>
      {warningConstants[warningConstantMapper]}
      <Alert
        variant="info"
        isInline
        title={filterMessage || INFO_ALERT_SYSTEMS}
      />
      <SystemTable
        bulkSelectIds={bulkSelectIds}
        selectedIds={selectedIds}
        selectIds={selectIds}
        setFilterSortString={setFilterSortString}
        slug={slug}
      />
    </React.Fragment>
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
