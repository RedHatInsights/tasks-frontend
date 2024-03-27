import { Button, EmptyStateActions } from '@patternfly/react-core';
import { AddCircleOIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import PropTypes from 'prop-types';
import React from 'react';
import EmptyStateDisplay from '../../PresentationalComponents/EmptyStateDisplay/EmptyStateDisplay';
import useFeatureFlag from '../../Utilities/useFeatureFlag';
import {
  QUICKSTART_TO_FEATURE_FLAG,
  SLUG_TO_QUICKSTART,
} from '../AvailableTasks/QuickstartButton';

const NoCentOsEmptyState = ({ slug }) => {
  const quickstartName = SLUG_TO_QUICKSTART[slug];
  const featureFlagName = QUICKSTART_TO_FEATURE_FLAG[quickstartName];

  const { quickStarts } = useChrome();
  const quickStartEnabled = useFeatureFlag(featureFlagName);

  return (
    <EmptyStateDisplay
      icon={AddCircleOIcon}
      title="No CentOS systems found"
      ouiaId="NoCentOSEmptyState"
      text={[
        'You currently have no CentOS systems registered to this account. Get started by installing the client tools on your CentOS machines to view them in Insights',
      ]}
      button={
        <>
          {quickStartEnabled ? (
            <EmptyStateActions>
              <Button
                variant="primary"
                onClick={() => quickStarts.activateQuickstart(quickstartName)}
              >
                Help me get started
              </Button>
            </EmptyStateActions>
          ) : null}
          <EmptyStateActions>
            <Button
              variant="link"
              icon={<ExternalLinkAltIcon />}
              iconPosition="end"
              component="a"
              href="https://access.redhat.com/documentation/en-us/red_hat_insights/1-latest/html/converting_from_an_rpm-based_linux_distribution_to_rhel_using_red_hat_insights/proc_preparing-for-a-rhel-conversion-using-insights_converting-from-a-linux-distribution-to-rhel-in-insights"
              target="_blank"
            >
              Learn more about connecting CentOS systems to Insights
            </Button>
          </EmptyStateActions>
        </>
      }
    />
  );
};

NoCentOsEmptyState.propTypes = {
  slug: PropTypes.string.isRequired,
};

export { NoCentOsEmptyState };
