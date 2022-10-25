import React from 'react';
import EntryRow from './EntryRow';
import EntryDetails from './EntryDetails';

const sortBySeverity = (entries) => {
  let sortedEntries = entries.sort((a, b) => {
    if (
      (a.severity === 'high' && b.severity !== 'high') ||
      (a.severity === 'low' && b.severity === 'info')
    ) {
      return -1;
    }

    if (
      (b.severity === 'high' && a.severity !== 'high') ||
      (b.severity === 'low' && a.severity === 'info')
    ) {
      return 1;
    }

    return 0;
  });

  return sortedEntries;
};

export const buildResultsRows = (entries) => {
  let rows = [];
  let sortedEntries = sortBySeverity(entries);
  sortedEntries.forEach((entry) => {
    rows.push({
      parent: <EntryRow severity={entry.severity} title={entry.title} />,
      child: <EntryDetails entry={entry} />,
    });
  });

  return rows;
};
