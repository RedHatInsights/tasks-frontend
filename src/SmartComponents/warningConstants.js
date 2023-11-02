import React from 'react';
import { Alert } from '@patternfly/react-core/dist/js/components/Alert';

const CONVERT_TO_RHEL_PREANALYSIS_WARNING = (
  <Alert
    style={{ marginBottom: '8px' }}
    isInline
    variant="warning"
    title="System backup is recommended."
  >
    <p>
      The pre-conversion analysis task modifies the systems during the analysis
      and then rolls back these changes when the analysis is complete. In rare
      cases, this rollback can fail. It is highly recommended that you create a
      system backup and verify that you can restore your system from the backup
      before running this task.
    </p>
  </Alert>
);

export default {
  CONVERT_TO_RHEL_PREANALYSIS_WARNING,
};
