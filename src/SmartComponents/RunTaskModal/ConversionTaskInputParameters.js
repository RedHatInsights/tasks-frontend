import React from 'react';
import propTypes from 'prop-types';
import {
  Alert,
  Form,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import { findParameterByKey } from './helpers';
import ParameterCheckboxGroup from './ParameterCheckboxGroup';
import ParameterCheckbox from './ParameterCheckbox';
import {
  CONVERT2RHEL_CONVERSION_TITLE,
  CONVERT2RHEL_CONVERSION_DESCRIPTION,
  CONVERT2RHEL_ANALYSIS_TITLE,
  CONVERT2RHEL_ANALYSIS_DESCRIPTION,
  ELS_DISABLED_CUSTOM_DESCRIPTION,
  ALLOW_UNAVAILABLE_KMODS_CUSTOM_DESCRIPTION,
  TAINTED_KERNEL_MODULE_CUSTOM_DESCRIPTION,
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
  const skipTaintedKernelModuleCheck = findParameterByKey(
    parameters,
    'CONVERT2RHEL_TAINTED_KERNEL_MODULE_CHECK_SKIP'
  );
  const optionalRepositories = findParameterByKey(
    parameters,
    'OPTIONAL_REPOSITORIES'
  );

  const updateParameter = (parameter, newValue) => {
    setDefinedParameters((prevState) =>
      prevState.map((param) =>
        param.key === parameter.key
          ? { key: param.key, value: newValue }
          : param
      )
    );
  };

  let formTitle = CONVERT2RHEL_CONVERSION_TITLE;
  let formDescription = CONVERT2RHEL_CONVERSION_DESCRIPTION;
  if (slug.includes('analysis')) {
    formTitle = CONVERT2RHEL_ANALYSIS_TITLE;
    formDescription = CONVERT2RHEL_ANALYSIS_DESCRIPTION;
  }

  return (
    <Form>
      <Content>
        <Content component={ContentVariants.h4}>{formTitle}</Content>
        <Content component={ContentVariants.p}>{formDescription}</Content>
      </Content>
      <ParameterCheckbox
        parameter={elsDisabled}
        updateParameter={updateParameter}
        customDescription={ELS_DISABLED_CUSTOM_DESCRIPTION}
      />
      <Content>
        <Content component={ContentVariants.h4}>
          Ignore specific pre-conversion analysis check results.
        </Content>
      </Content>
      <Alert variant="warning" isInline title="Resolve issues if possible">
        Use these at your discretion and resolve the issues if possible.
        Overriding issues can cause the conversion to fail, resulting in a
        deteriorated system state.
      </Alert>
      <ParameterCheckbox
        parameter={unavailableKmods}
        updateParameter={updateParameter}
        customDescription={ALLOW_UNAVAILABLE_KMODS_CUSTOM_DESCRIPTION}
      />
      <ParameterCheckbox
        parameter={skipKernelCheck}
        updateParameter={updateParameter}
      />
      <ParameterCheckbox
        parameter={skipPackageCheck}
        updateParameter={updateParameter}
      />
      {skipTaintedKernelModuleCheck && (
        <ParameterCheckbox
          parameter={skipTaintedKernelModuleCheck}
          updateParameter={updateParameter}
          customDescription={TAINTED_KERNEL_MODULE_CUSTOM_DESCRIPTION}
        />
      )}
      {optionalRepositories && (
        <ParameterCheckboxGroup
          parameter={optionalRepositories}
          updateParameter={updateParameter}
        />
      )}
    </Form>
  );
};

ConversionTaskInputParameters.propTypes = {
  slug: propTypes.string.isRequired,
  parameters: propTypes.array.isRequired,
  setDefinedParameters: propTypes.func.isRequired,
};

export default ConversionTaskInputParameters;
