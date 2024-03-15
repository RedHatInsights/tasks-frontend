import React from 'react';
import propTypes from 'prop-types';
import {
  Text,
  TextContent,
  TextVariants,
  Timestamp,
  TimestampFormat,
  Tooltip,
} from '@patternfly/react-core';

const RefreshFooterContent = ({ date, isRunning, type }) => {
  return (
    <div>
      <Tooltip
        content={
          'Updates every minute automatically when there is a running task'
        }
      >
        <TextContent>
          <Text component={TextVariants.small}>
            Last updated
            {isRunning ? (
              <>
                {' '}
                <Timestamp
                  date={date}
                  dateFormat={TimestampFormat.full}
                  timeFormat={TimestampFormat.full}
                />
              </>
            ) : (
              `: All ${type} completed`
            )}
          </Text>
        </TextContent>
      </Tooltip>
    </div>
  );
};

RefreshFooterContent.propTypes = {
  date: propTypes.object,
  isRunning: propTypes.bool,
  type: propTypes.string,
};

export default RefreshFooterContent;
