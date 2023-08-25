import React from 'react';
import EntryRow from './EntryRow';
import EntryDetails from './EntryDetails';

const sortBySeverity = (entries) => {
  let sortedEntries = entries.sort((a, b) => {
    if (
      (a.severity === 'Error' && b.severity !== 'Error') ||
      (a.severity === 'Warning' && b.severity === 'Info')
    ) {
      return -1;
    }

    if (
      (b.severity === 'Error' && a.severity !== 'Error') ||
      (b.severity === 'Warning' && a.severity === 'Info')
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
