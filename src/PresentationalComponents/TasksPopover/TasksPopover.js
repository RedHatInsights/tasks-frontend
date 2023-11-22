import React from 'react';
import PropTypes from 'prop-types';

import { Popover } from '@patternfly/react-core';

const TasksPopover = ({ body, content, footer, header, label }) => {
  return (
    <div>
      <Popover
        minWidth="35rem"
        aria-label={label}
        headerContent={header}
        bodyContent={body}
        footerContent={footer}
      >
        {content}
      </Popover>
    </div>
  );
};

TasksPopover.propTypes = {
  body: PropTypes.any,
  content: PropTypes.any,
  footer: PropTypes.any,
  header: PropTypes.any,
  label: PropTypes.string,
};

export default TasksPopover;
