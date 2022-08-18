import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';

export const EmptyStateDisplay = ({
  button,
  color,
  error,
  icon,
  isSmall,
  text,
  title,
}) => {
  return (
    <EmptyState
      variant={isSmall ? EmptyStateVariant.small : EmptyStateVariant.large}
      aria-label={error ? 'error-empty-state' : 'empty-state'}
    >
      {icon ? (
        <EmptyStateIcon
          icon={icon}
          color={color ? color : null}
          className={isSmall ? 'small-empty-state-icon' : null}
        />
      ) : null}
      <br></br>
      <Title headingLevel={isSmall ? 'h5' : 'h1'} size={isSmall ? 'md' : 'lg'}>
        {title}
      </Title>
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
      {button}
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
};

export default EmptyStateDisplay;
