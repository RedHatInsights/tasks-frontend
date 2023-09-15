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

export const buildResultsRows = (entries, isReportJson, taskSlug) => {
  let taskConstantMapper = taskSlug.toLowerCase().replace(/-/g, '');
  let rows = [];
  let sortedEntries;
  if (isReportJson) {
    sortedEntries = sortBySeverity(entries, `${taskConstantMapper}SeverityMap`);
    sortedEntries.forEach((entry) => {
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
    });
  } else {
    sortedEntries = entries;
    rows = sortedEntries[0];
  }

  return rows;
};
