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

export const buildResultsRows = (entries, isReportJson) => {
  let rows = [];
  let sortedEntries;
  if (isReportJson) {
    sortedEntries = sortBySeverity(entries);
    rows = sortedEntries.map((entry) => ({
      parent: <EntryRow severity={entry.severity} title={entry.title} />,
      child: <EntryDetails entry={entry} />,
    }));
  } else {
    sortedEntries = entries;
    rows = sortedEntries[0];
  }

  return rows;
};
