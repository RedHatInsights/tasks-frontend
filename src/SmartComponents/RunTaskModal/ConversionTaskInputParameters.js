import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Alert,
  Checkbox,
  Form,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

const ConversionTaskInputParameters = ({
  slug,
  parameters,
  setDefinedParameters,
}) => {
  const [elsDisabled, unavailableKmods, skipKernelCheck, skipPackageCheck] =
    parameters;
  const [elsDisabledValue, setElsDisabledValue] = useState(elsDisabled.default);
  const [unavailableKmodsValue, setUnavailableKmodsValue] = useState(
    unavailableKmods.default
  );
  const [skipKernelCheckValue, setSkipKernelCheckValue] = useState(
    skipKernelCheck.default
  );
  const [skipPackageCheckValue, setSkipPackageCheckValue] = useState(
    skipPackageCheck.default
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
  const toBool = (value) => {
    return value.toLowerCase() === 'true' || value === '1' || value === 1;
  };

  const createCheckbox = (
    parameter,
    currValue,
    setValue,
    customDescription = undefined
  ) => {
    return (
      <Checkbox
        id={parameter.key}
        label={parameter.title}
        description={customDescription || parameter.description}
        isChecked={toBool(currValue)}
        onChange={(_event, checkedValue) => {
          let newValue;
          if (currValue === '0' || currValue === '1') {
            newValue = checkedValue ? '1' : '0';
          } else {
            newValue = checkedValue ? 'True' : 'False';
          }
          setValue(newValue);
          updateParameters(parameter, newValue);
        }}
      />
    );
  };

  const createLink = (href, text) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );

  const readMoreLink = createLink(
    'https://www.redhat.com/en/blog/announcing-4-years-extended-life-cycle-support-els-red-hat-enterprise-linux-7',
    'Read more about ELS for RHEL 7.'
  );

  const convert2RHELSupportLink = createLink(
    'https://access.redhat.com/support/policy/convert2rhel-support',
    'Convert2RHEL Support Policy'
  );

  const inPlaceSupportLink = createLink(
    'https://access.redhat.com/support/policy/ipu-support',
    'In-place upgrade Support Policy'
  );

  const analysisTitleSection = (
    <TextContent>
      <Text component={TextVariants.h4}>
        Analyze conversion to RHEL 7 without Extended Lifecycle Support (ELS)
      </Text>
      <Text component={TextVariants.p}>
        By default, the task analyzes a conversion of your CentOS Linux 7 to a
        supported RHEL 7 system with the latest security patches and updates via
        ELS. {readMoreLink}
      </Text>
    </TextContent>
  );

  const convertTitleSection = (
    <TextContent>
      <Text component={TextVariants.h4}>
        Convert to RHEL 7 without Extended Lifecycle Support (ELS)
      </Text>
      <Text component={TextVariants.p}>
        By default, the task converts your CentOS Linux 7 to a supported RHEL 7
        system with the latest security patches and updates via ELS.{' '}
        {readMoreLink}
      </Text>
    </TextContent>
  );

  const elsDisabledDescription = (
    <div>
      If you plan to upgrade to RHEL 8 right after the conversion, you may opt
      opt not to use the ELS subscription. Note that the conversion and the
      subsequent upgrade without an ELS subscription come with a limited support
      scope per the {convert2RHELSupportLink} and the {inPlaceSupportLink}.
    </div>
  );

  return (
    <Form className="pf-v5-u-pb-lg">
      {slug.includes('analysis') ? analysisTitleSection : convertTitleSection}

      {createCheckbox(
        elsDisabled,
        elsDisabledValue,
        setElsDisabledValue,
        elsDisabledDescription
      )}

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

      {createCheckbox(
        unavailableKmods,
        unavailableKmodsValue,
        setUnavailableKmodsValue
      )}

      {createCheckbox(
        skipKernelCheck,
        skipKernelCheckValue,
        setSkipKernelCheckValue
      )}

      {createCheckbox(
        skipPackageCheck,
        skipPackageCheckValue,
        setSkipPackageCheckValue
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
