import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons';
import React from 'react';

const converttorhelpreanalysisSeverityMap = {
  error: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon color="#C9190B" />,
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2500,
  },
  overridable: {
    text: 'Overridable',
    icon: <ExclamationCircleIcon color="#C9190B" />,
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2000,
  },
  skip: {
    text: 'Skipped',
    icon: <ExclamationCircleIcon color="#C9190B" />,
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 1500,
  },
  warning: {
    text: 'Warning',
    icon: <ExclamationTriangleIcon color="#F0AB00" />,
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1000,
  },
  info: {
    text: 'Info',
    icon: <InfoCircleIcon color="#2B9AF3" />,
    titleColor: '#002952',
    severityColor: 'blue',
    severityLevel: 500,
  },
  success: {
    text: 'Success',
    icon: <CheckCircleIcon color="green" />,
    titleColor: 'green',
    severityColor: 'green',
    severityLevel: 0,
  },
};

const converttorhelpreanalysisstageSeverityMap = {
  error: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon color="#C9190B" />,
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2500,
  },
  overridable: {
    text: 'Overridable',
    icon: <ExclamationCircleIcon color="#C9190B" />,
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2000,
  },
  skip: {
    text: 'Skipped',
    icon: <ExclamationCircleIcon color="#C9190B" />,
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 1500,
  },
  warning: {
    text: 'Warning',
    icon: <ExclamationTriangleIcon color="#F0AB00" />,
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1000,
  },
  info: {
    text: 'Info',
    icon: <InfoCircleIcon color="#2B9AF3" />,
    titleColor: '#002952',
    severityColor: 'blue',
    severityLevel: 500,
  },
  success: {
    text: 'Success',
    icon: <CheckCircleIcon color="green" />,
    titleColor: 'green',
    severityColor: 'green',
    severityLevel: 0,
  },
};

const leapppreupgradeSeverityMap = {
  high: {
    text: 'High risk',
    icon: <ExclamationCircleIcon color="#C9190B" />,
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 1500,
  },
  low: {
    text: 'Low risk',
    icon: <ExclamationTriangleIcon color="#F0AB00" />,
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1000,
  },
  info: {
    text: 'Info',
    icon: <InfoCircleIcon color="#2B9AF3" />,
    titleColor: '#002952',
    severityColor: 'blue',
    severityLevel: 500,
  },
};

export default {
  converttorhelpreanalysisSeverityMap,
  converttorhelpreanalysisstageSeverityMap,
  leapppreupgradeSeverityMap,
};
