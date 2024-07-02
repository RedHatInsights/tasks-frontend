// csv

// System name, Status, Message, Report
// Issue title, Issue severity, Issue key, Issue summary, Issue diagnosis
// Issue remediation type, Issue remediation

const parseReportDiagnosis = (detail) => {
  const { diagnosis } = detail;

  return diagnosis?.context ?? diagnosis?.[0]?.context ?? '';
};

const parseReportRemediations = (detail) => {
  const { remediations } = detail;

  if (Array.isArray(remediations)) {
    return remediations.map(({ type, context }) => [type, context]);
  }

  if (typeof remediations === 'object') {
    return [remediations?.type ?? '', remediations?.context ?? ''];
  }

  return [];
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

      return remediations.map((remediation) => [
        title,
        severity,
        key,
        summary,
        diagnosis,
        ...remediation,
      ]);
    })
    .flat();
};

const parseJobReport = (job) => {
  const { report, report_json } = job.results;

  if (report_json !== undefined && report_json !== null) {
    const issues = parseReportJson(report_json);

    if (issues.length === 0) {
      return [report];
    } else {
      console.log('### issues', issues);
      return issues.map((issue) => [report, ...issue]);
    }
  }

  return [report];
};

export { parseJobReport };
