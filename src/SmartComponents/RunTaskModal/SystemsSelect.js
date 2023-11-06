import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Alert } from '@patternfly/react-core/dist/js/components/Alert';
import { Flex, FlexItem } from '@patternfly/react-core/dist/js/layouts/Flex';
import {
  Form,
  FormGroup,
} from '@patternfly/react-core/dist/js/components/Form';
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput';
import { ValidatedOptions } from '@patternfly/react-core/dist/js/helpers/constants';
import SystemTable from '../SystemTable/SystemTable';
import {
  AVAILABLE_TASKS_ROOT,
  INFO_ALERT_SYSTEMS,
  TASKS_API_ROOT,
} from '../../constants';
import ReactMarkdown from 'react-markdown';
import { fetchSystems } from '../../../api';
import warningConstants from '../warningConstants';

const SystemsSelect = ({
  createTaskError,
  description,
  selectedIds,
  setSelectedIds,
  setTaskName,
  slug,
  taskName,
}) => {
  const warningConstantMapper = `${slug
    ?.toUpperCase()
    .replace(/-/g, '_')}_WARNING`;

  const [filterSortString, setFilterSortString] = useState('');

  const bulkSelectIds = async (type, options) => {
    let newSelectedIds = [...selectedIds];

    switch (type) {
      case 'none': {
        setSelectedIds([]);
        break;
      }

      case 'page': {
        options.items.forEach((item) => {
          if (!newSelectedIds.includes(item.id)) {
            newSelectedIds.push(item.id);
          }
        });

        setSelectedIds(newSelectedIds);
        break;
      }

      case 'all': {
        let results = await fetchSystems(filterSortString);
        setSelectedIds(results.data.map(({ id }) => id));
        break;
      }
    }
  };

  const selectIds = (_event, _isSelected, _index, entity) => {
    let newSelectedIds = [...selectedIds];

    !newSelectedIds.includes(entity.id)
      ? newSelectedIds.push(entity.id)
      : newSelectedIds.splice(newSelectedIds.indexOf(entity.id), 1);

    setSelectedIds(newSelectedIds);
  };

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
          <FormGroup
            label="Task name"
            isRequired
            type="text"
            helperTextInvalid={
              Object.prototype.hasOwnProperty.call(
                createTaskError,
                'statusText'
              ) && createTaskError.statusText
            }
            fieldId="name"
            validated={
              Object.prototype.hasOwnProperty.call(createTaskError, 'status') &&
              'error'
            }
          >
            <TextInput
              value={taskName}
              type="text"
              onChange={setTaskName}
              validated={
                Object.prototype.hasOwnProperty.call(
                  createTaskError,
                  'status'
                ) && ValidatedOptions.error
              }
              aria-label="task name"
            />
          </FormGroup>
        </Form>
      </div>
      <br />
      <div style={{ paddingBottom: '8px' }}>
        <b>Systems to run tasks on</b>
      </div>
      {warningConstants[warningConstantMapper]}
      <Alert variant="info" isInline title={INFO_ALERT_SYSTEMS} />
      <SystemTable
        bulkSelectIds={bulkSelectIds}
        selectedIds={selectedIds}
        selectIds={selectIds}
        setFilterSortString={setFilterSortString}
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
};

export default SystemsSelect;
