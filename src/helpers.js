import React from 'react';

export const createSystemLink = (id, name, keyData, isBetaEnv) => (
  <a
    rel="noreferrer"
    target="_blank"
    key={keyData}
    href={
      isBetaEnv
        ? `/preview/insights/inventory/${id}`
        : `/insights/inventory/${id}`
    }
  >
    {name}
  </a>
);
