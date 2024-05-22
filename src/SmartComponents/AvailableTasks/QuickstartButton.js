import React from 'react';
import useFeatureFlag from '../../Utilities/useFeatureFlag';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';

export const SLUG_TO_QUICKSTART = {
  'convert-to-rhel-preanalysis-stage': 'insights-tasks-pre-conversion',
  'convert-to-rhel-preanalysis': 'insights-tasks-pre-conversion',
  'convert-to-rhel-conversion-stage': 'insights-tasks-conversion',
  'convert-to-rhel-conversion': 'insights-tasks-conversion',
  'leapp-preupgrade-stage': 'insights-tasks-upgrade8to9',
  'leapp-preupgrade': 'insights-tasks-upgrade8to9',
};

export const CENTOS_CONVERSION_SLUGS = [
  'convert-to-rhel-preanalysis-stage',
  'convert-to-rhel-preanalysis',
  'convert-to-rhel-conversion-stage',
  'convert-to-rhel-conversion',
];

export const QUICKSTART_TO_FEATURE_FLAG = {
  'insights-tasks-pre-conversion':
    'tasks-frontend_pre-conversion-quickstart-active',
  'insights-tasks-conversion': 'tasks-frontend_conversion-quickstart-active',
  'insights-tasks-upgrade8to9': 'tasks-frontend_leapp-quickstart-active',
};

const QuickstartButton = ({ isTaskCard, slug }) => {
  const quickstartName = SLUG_TO_QUICKSTART[slug];
  const featureFlagName = QUICKSTART_TO_FEATURE_FLAG[quickstartName];

  const { quickStarts } = useChrome();
  const enabled =
    featureFlagName !== undefined ? useFeatureFlag(featureFlagName) : true;

  return enabled ? (
    <Button
      variant={isTaskCard ? 'secondary' : 'link'}
      iconPosition="end"
      onClick={() => quickStarts.activateQuickstart(quickstartName)}
    >
      Help me get started
    </Button>
  ) : null;
};

QuickstartButton.propTypes = {
  isTaskCard: propTypes.bool,
  slug: propTypes.string.isRequired,
};

export { QuickstartButton };
