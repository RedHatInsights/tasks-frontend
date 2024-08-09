// extended utilities parse jobs with report_json available

export const encodeCsvCell = (
  cell // https://www.ietf.org/rfc/rfc4180.txt
) =>
  typeof cell === 'string'
    ? `"${cell.replaceAll('"', '""')}"`
    : Array.isArray(cell)
    ? `"${cell.map(encodeCsvCell)}"`
    : cell;

const parseReportDiagnosis = (detail) => {
  const { diagnosis } = detail || {};

  return diagnosis?.context ?? diagnosis?.[0]?.context ?? '';
};

const parseReportRemediations = (detail) => {
  const { remediations } = detail || {};

  if (Array.isArray(remediations)) {
    return remediations.map(({ type, context }) => ({ type, context }));
  }

  if (typeof remediations === 'object') {
    return [
      { type: remediations?.type ?? '', context: remediations?.context ?? '' },
    ];
  }

  return [{ type: '', context: '' }];
};

const parseReportJson = (report) => {
  const { entries } = report;

  if (entries === undefined || entries === null) {
    return [];
  }

  return entries
    .map(({ title, severity, key, summary, detail }) => {
      const diagnosis = parseReportDiagnosis(detail);
      const remediations = parseReportRemediations(detail);

      if (remediations.length > 0) {
        return remediations.map((remediation) => ({
          title,
          severity,
          key,
          summary,
          diagnosis,
          remediationType: remediation.type,
          remediationContext: remediation.context,
        }));
      } else {
        return [
          {
            title,
            severity,
            key,
            summary,
            diagnosis,
            remediationType: '',
            remediationContext: '',
          },
        ];
      }
    })
    .flat();
};

export const parseJobReport = (job) => {
  const { report_json } = job?.results || {};

  if (report_json !== undefined && report_json !== null) {
    const issues = parseReportJson(report_json);

    if (issues.length === 0) {
      return [job];
    } else {
      return issues.map((issue) => ({ ...job, issue_parsed: issue }));
    }
  }

  return [job];
};

export const prepareItems = (items) =>
  items.map((job) => parseJobReport(job)).flat();
