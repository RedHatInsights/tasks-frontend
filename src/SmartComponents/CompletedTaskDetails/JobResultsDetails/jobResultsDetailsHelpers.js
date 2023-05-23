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
