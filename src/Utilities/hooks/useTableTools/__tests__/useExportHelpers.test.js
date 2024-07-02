import { parseJobReport } from '../useExportHelpers';
import {
  fixturesExtendedReport,
  fixturesPlainReport,
} from './__fixtures__/jobResultsItems.fixtures';

describe('parseJobReport', () => {
  it('returns just plain report', () => {
    expect(parseJobReport(fixturesPlainReport)).toMatchInlineSnapshot(`
      [
        "Lorem ipsum dolor sit amet, "consectetuer" adipiscing elit. Maecenas fermentum, sem in pharetra pellentesque, velit turpis > !volutpat ante, in pharetra metus odio a lectus. ",
      ]
    `);
  });

  it('returns fields from report_json', () => {
    expect(parseJobReport(fixturesExtendedReport)).toMatchInlineSnapshot(`
      [
        [
          "Lorem ipsum dolor sit amet, "consectetuer" adipiscing elit. Maecenas fermentum, sem in pharetra pellentesque, velit turpis > !volutpat ante, in pharetra metus odio a lectus. ",
          "Some issue title",
          "info",
          "test_issue_key",
          "some summary",
          "Some diagnosis report",
          "hint",
          "Some description of remediation step",
        ],
        [
          "Lorem ipsum dolor sit amet, "consectetuer" adipiscing elit. Maecenas fermentum, sem in pharetra pellentesque, velit turpis > !volutpat ante, in pharetra metus odio a lectus. ",
          "Some issue title",
          "info",
          "test_issue_key",
          "some summary",
          "Some diagnosis report",
          "warning",
          "Some description of another remediation step",
        ],
      ]
    `);
  });
});
