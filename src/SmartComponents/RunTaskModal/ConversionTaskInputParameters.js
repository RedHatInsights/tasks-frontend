import React from 'react';
import propTypes from 'prop-types';
import {
  Alert,
  Form,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { findParameterByKey } from '../../Utilities/helpers';
import { ParameterCheckboxGroup } from './ParameterCheckboxGroup';
import { ParameterCheckbox } from './ParameterCheckbox';
import {
  CONVERT2RHEL_CONVERSION_TITLE,
  CONVERT2RHEL_CONVERSION_DESCRIPTION,
  CONVERT2RHEL_ANALYSIS_TITLE,
  CONVERT2RHEL_ANALYSIS_DESCRIPTION,
  ELS_DISABLED_CUSTOM_DESCRIPTION,
} from '../../constants';

const ConversionTaskInputParameters = ({
  slug,
  parameters,
  setDefinedParameters,
}) => {
  const elsDisabled = findParameterByKey(parameters, 'ELS_DISABLED');
  const unavailableKmods = findParameterByKey(
    parameters,
    'CONVERT2RHEL_ALLOW_UNAVAILABLE_KMODS'
  );
  const skipKernelCheck = findParameterByKey(
    parameters,
    'CONVERT2RHEL_SKIP_KERNEL_CURRENCY_CHECK'
  );
  const skipPackageCheck = findParameterByKey(
    parameters,
    'CONVERT2RHEL_OUTDATED_PACKAGE_CHECK_SKIP'
  );
  const optionalRepositories = findParameterByKey(
    parameters,
    'OPTIONAL_REPOSITORIES'
  );

  const updateParameters = (parameter, newValue) => {
    setDefinedParameters((prevState) => {
      return prevState.map((param) => {
        if (param.key === parameter.key) {
          return { key: param.key, value: newValue };
        } else {
          return param;
        }
      });
    });
  };

  let formTitle = CONVERT2RHEL_CONVERSION_TITLE;
  let formDescription = CONVERT2RHEL_CONVERSION_DESCRIPTION;
  if (slug.includes('analysis')) {
    formTitle = CONVERT2RHEL_ANALYSIS_TITLE;
    formDescription = CONVERT2RHEL_ANALYSIS_DESCRIPTION;
  }

  return (
    <Form className="pf-v5-u-pb-lg">
      <TextContent>
        <Text component={TextVariants.h4}>{formTitle}</Text>
        <Text component={TextVariants.p}>{formDescription}</Text>
      </TextContent>
      <ParameterCheckbox
        parameter={elsDisabled}
        updateParameters={updateParameters}
        customDescription={ELS_DISABLED_CUSTOM_DESCRIPTION}
      />
      <TextContent>
        <Text component={TextVariants.h4}>
          Ignore specific pre-conversion analysis check results.
        </Text>
      </TextContent>
      <Alert variant="warning" isInline title="Resolve issues if possible">
        Use these at your discretion and resolve the issues if possible.
        Overriding issues can cause the conversion to fail, resulting in a
        deteriorated system state.
      </Alert>
      <ParameterCheckbox
        parameter={unavailableKmods}
        updateParameters={updateParameters}
      />
      <ParameterCheckbox
        parameter={skipKernelCheck}
        updateParameters={updateParameters}
      />
      <ParameterCheckbox
        parameter={skipPackageCheck}
        updateParameters={updateParameters}
      />
      <ParameterCheckboxGroup
        parameter={optionalRepositories}
        updateParameters={updateParameters}
      />
    </Form>
  );
};

ConversionTaskInputParameters.propTypes = {
  slug: propTypes.string.isRequired,
  parameters: propTypes.array.isRequired,
  setDefinedParameters: propTypes.func.isRequired,
};

export default ConversionTaskInputParameters;
