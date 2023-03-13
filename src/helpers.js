import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

export const createSystemLink = (id, name, keyData) => {
  const chrome = useChrome();
  const isBetaEnv = chrome.isBeta();

  if (chrome) {
    return (
      <a
        rel="noreferrer"
        target="_blank"
        key={keyData}
        href={
          isBetaEnv
            ? `/beta/insights/inventory/${id}`
            : `/insights/inventory/${id}`
        }
      >
        {name}
      </a>
    );
  }
};
