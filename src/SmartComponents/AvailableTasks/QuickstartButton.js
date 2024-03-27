import React from 'react';
import useFeatureFlag from '../../Utilities/useFeatureFlag';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { Button } from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';

export const SLUG_TO_QUICKSTART = {
  'convert-to-rhel-preanalysis-stage': 'pre-conversion-quickstart',
  'convert-to-rhel-preanalysis': 'pre-conversion-quickstart',
  'convert-to-rhel-conversion-stage': 'conversion-quickstart',
  'convert-to-rhel-conversion': 'conversion-quickstart',
  'leapp-preupgrade-stage': 'leapp-quickstart',
  'leapp-preupgrade': 'leapp-quickstart',
};

export const CENTOS_CONVERSION_SLUGS = [
  'convert-to-rhel-preanalysis-stage',
  'convert-to-rhel-preanalysis',
  'convert-to-rhel-conversion-stage',
  'convert-to-rhel-conversion',
];

export const QUICKSTART_TO_FEATURE_FLAG = {
  'pre-conversion-quickstart':
    'tasks-frontend_pre-conversion-quickstart-active',
  'conversion-quickstart': 'tasks-frontend_conversion-quickstart-active',
  'leapp-quickstart': 'tasks-frontend_leapp-quickstart-active',
};

const QuickstartButton = ({ slug }) => {
  const quickstartName = SLUG_TO_QUICKSTART[slug];
  const featureFlagName = QUICKSTART_TO_FEATURE_FLAG[quickstartName];

  const { quickStarts } = useChrome();
  const enabled =
    featureFlagName !== undefined ? useFeatureFlag(featureFlagName) : true;

  return enabled ? (
    <Button
      variant="link"
      icon={<ArrowRightIcon />}
      iconPosition="end"
      onClick={() => quickStarts.activateQuickstart(quickstartName)}
    >
      Help me get started
    </Button>
  ) : null;
};

QuickstartButton.propTypes = {
  slug: propTypes.string.isRequired,
};

export { QuickstartButton };
