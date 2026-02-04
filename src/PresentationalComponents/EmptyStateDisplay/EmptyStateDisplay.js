import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateFooter,
} from '@patternfly/react-core';

export const EmptyStateDisplay = ({
  button,
  error,
  icon,
  isSmall,
  text,
  title,
  ouiaId,
}) => {
  return (
    <EmptyState
      headingLevel={isSmall ? 'h5' : 'h1'}
      titleText={title}
      variant={isSmall ? EmptyStateVariant.sm : EmptyStateVariant.lg}
      aria-label={error ? 'error-empty-state' : 'empty-state'}
      icon={icon}
      iconClassName={isSmall ? 'small-empty-state-icon' : null}
      {...(ouiaId !== undefined ? { 'data-ouia-component-id': ouiaId } : {})}
    >
      <EmptyStateBody>
        {text
          ? text.map((line, index) => (
              <React.Fragment key={`line-${index}`}>
                {line}
                <br />
              </React.Fragment>
            ))
          : null}
        {error ? error : null}
      </EmptyStateBody>
      <EmptyStateFooter>{button}</EmptyStateFooter>
    </EmptyState>
  );
};

EmptyStateDisplay.propTypes = {
  button: PropTypes.object,
  color: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.any,
  isSmall: PropTypes.bool,
  text: PropTypes.array,
  title: PropTypes.string,
  ouiaId: PropTypes.string,
};

export default EmptyStateDisplay;
