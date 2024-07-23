// extended utilities parse jobs with report_json available

export const encodeCsvString = (str) => `"${encodeURI(str)}"`;

const parseReportDiagnosis = (detail) => {
  const { diagnosis } = detail || {};

  return diagnosis?.context ?? diagnosis?.[0]?.context ?? '';
};

const parseReportRemediations = (detail) => {
  const { remediations } = detail || {};

  if (Array.isArray(remediations)) {
    return remediations.map(({ type, context }) => [type, context]);
  }

  if (typeof remediations === 'object') {
    return [[remediations?.type ?? '', remediations?.context ?? '']];
  }

  return [['', '']];
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
        return remediations.map((remediation) => [
          title,
          severity,
          key,
          summary,
          diagnosis,
          ...remediation,
        ]);
      } else {
        return [title, severity, key, summary, diagnosis];
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
