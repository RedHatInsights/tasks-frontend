import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';
import React from 'react';

const converttorhelconversionSeverityMap = {
  error: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2500,
  },
  overridable: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2000,
  },
  skip: {
    text: 'Skipped',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 1500,
  },
  warning: {
    text: 'Warning',
    icon: <ExclamationTriangleIcon />,
    iconSeverityColor: 'warning',
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1000,
  },
  info: {
    text: 'Info',
    icon: <InfoCircleIcon />,
    iconSeverityColor: 'info',
    titleColor: '#002952',
    severityColor: 'blue',
    severityLevel: 500,
  },
};

// constant to be removed
const converttorhelconversionstageSeverityMap = {
  error: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2500,
  },
  overridable: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2000,
  },
  skip: {
    text: 'Skipped',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 1500,
  },
  warning: {
    text: 'Warning',
    icon: <ExclamationTriangleIcon />,
    iconSeverityColor: 'warning',
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1000,
  },
  info: {
    text: 'Info',
    icon: <InfoCircleIcon />,
    iconSeverityColor: 'info',
    titleColor: '#002952',
    severityColor: 'blue',
    severityLevel: 500,
  },
};

const converttorhelanalysisSeverityMap = {
  error: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2500,
  },
  overridable: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2000,
  },
  skip: {
    text: 'Skipped',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 1500,
  },
  warning: {
    text: 'Warning',
    icon: <ExclamationTriangleIcon />,
    iconSeverityColor: 'warning',
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1000,
  },
  info: {
    text: 'Info',
    icon: <InfoCircleIcon />,
    iconSeverityColor: 'info',
    titleColor: '#002952',
    severityColor: 'blue',
    severityLevel: 500,
  },
};

// constant to be removed
const converttorhelanalysisstageSeverityMap = {
  error: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2500,
  },
  overridable: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2000,
  },
  skip: {
    text: 'Skipped',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 1500,
  },
  warning: {
    text: 'Warning',
    icon: <ExclamationTriangleIcon />,
    iconSeverityColor: 'warning',
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1000,
  },
  info: {
    text: 'Info',
    icon: <InfoCircleIcon />,
    iconSeverityColor: 'info',
    titleColor: '#002952',
    severityColor: 'blue',
    severityLevel: 500,
  },
};

const converttorhelpreanalysisSeverityMap = converttorhelanalysisSeverityMap;
const converttorhelpreanalysisstageSeverityMap =
  converttorhelanalysisSeverityMap;

const leapppreupgradeSeverityMap = {
  inhibitor: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2500,
  },
  high: {
    text: 'High risk',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2000,
  },
  medium: {
    text: 'Medium risk',
    icon: <ExclamationTriangleIcon />,
    iconSeverityColor: 'warning',
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1500,
  },
  low: {
    text: 'Low risk',
    icon: <ExclamationTriangleIcon />,
    iconSeverityColor: 'warning',
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1000,
  },
  info: {
    text: 'Info',
    icon: <InfoCircleIcon />,
    iconSeverityColor: 'info',
    titleColor: '#002952',
    severityColor: 'blue',
    severityLevel: 500,
  },
};

const leappupgradeSeverityMap = {
  inhibitor: {
    text: 'Inhibitor',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2500,
  },
  high: {
    text: 'High risk',
    icon: <ExclamationCircleIcon />,
    iconSeverityColor: 'danger',
    titleColor: '#A30000',
    severityColor: 'red',
    severityLevel: 2000,
  },
  medium: {
    text: 'Medium risk',
    icon: <ExclamationTriangleIcon />,
    iconSeverityColor: 'warning',
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1500,
  },
  low: {
    text: 'Low risk',
    icon: <ExclamationTriangleIcon />,
    iconSeverityColor: 'warning',
    titleColor: '#795000',
    severityColor: 'orange',
    severityLevel: 1000,
  },
  info: {
    text: 'Info',
    icon: <InfoCircleIcon />,
    iconSeverityColor: 'info',
    titleColor: '#002952',
    severityColor: 'blue',
    severityLevel: 500,
  },
};

// constants to be removed
const leappupgradestageSeverityMap = leappupgradeSeverityMap;
const leapppreupgradestageSeverityMap = leapppreupgradeSeverityMap;
const leappupgradescriptstageSeverityMap = leappupgradeSeverityMap;
const leapppreupgradescriptstageSeverityMap = leapppreupgradeSeverityMap;

export default {
  converttorhelconversionSeverityMap,
  converttorhelconversionstageSeverityMap,
  converttorhelpreanalysisSeverityMap,
  converttorhelpreanalysisstageSeverityMap,
  converttorhelanalysisSeverityMap,
  converttorhelanalysisstageSeverityMap,
  leapppreupgradeSeverityMap,
  leapppreupgradescriptstageSeverityMap,
  leapppreupgradestageSeverityMap,
  leappupgradeSeverityMap,
  leappupgradescriptstageSeverityMap,
  leappupgradestageSeverityMap,
};
