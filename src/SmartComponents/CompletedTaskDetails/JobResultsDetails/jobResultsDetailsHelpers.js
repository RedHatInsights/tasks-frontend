import React from 'react';
import EntryRow from './EntryRow';
import EntryDetails from './EntryDetails';
import severityMap from '../TaskEntries';

const sortBySeverity = (entries, taskConstantMapper) => {
  let sortedEntries = entries.sort((a, b) => {
    let aSeverity =
      severityMap[taskConstantMapper][a.severity.toLowerCase()].severityLevel;
    let bSeverity =
      severityMap[taskConstantMapper][b.severity.toLowerCase()].severityLevel;
    if (aSeverity > bSeverity) {
      return -1;
    }

    if (bSeverity > aSeverity) {
      return 1;
    }

    return 0;
  });

  return sortedEntries;
};

export const buildResultsRows = (entries, taskSlug) => {
  let taskConstantMapper = taskSlug.toLowerCase().replace(/-/g, '');
  let rows = [];
  let sortedEntries = sortBySeverity(
    entries,
    `${taskConstantMapper}SeverityMap`
  );
  sortedEntries.forEach((entry) => {
    // this line to be removed
    if (entry.severity.toLowerCase() !== 'success') {
      rows.push({
        parent: (
          <EntryRow
            severity={entry.severity}
            title={entry.title}
            taskConstantMapper={`${taskConstantMapper}SeverityMap`}
          />
        ),
        child: (
          <EntryDetails
            entry={entry}
            taskConstantMapper={`${taskConstantMapper}SeverityMap`}
          />
        ),
      });
    }
  });

  return rows;
};
