import React from 'react';

export const createSystemLink = (id, name, keyData) => (
  <a
    rel="noreferrer"
    target="_blank"
    key={keyData}
    href={
      insights.chrome.isBeta()
        ? `/beta/insights/inventory/${id}`
        : `/insights/inventory/${id}`
    }
  >
    {name}
  </a>
);
