import cloneDeep from 'lodash/cloneDeep';
import { parseJobReport, prepareItems } from '../reportParser';
import {
  fixturesExtendedReport,
  fixturesPlainReport,
} from './__fixtures__/jobResultsItems.fixtures';

describe('parseJobReport', () => {
  it('should parse a job without report', () => {
    const parsed = parseJobReport(fixturesPlainReport);

    expect(parsed).toHaveLength(1);
    expect(parsed).toMatchSnapshot();
  });

  it('should parse a job with report_json', () => {
    const parsed = parseJobReport(fixturesExtendedReport);

    expect(parsed).toHaveLength(8);
    parsed.forEach(({ issue_parsed }) => {
      expect(issue_parsed).toMatchSnapshot();
    });
  });

  it('parses multiple remediatios for the extended report', () => {
    const fixtures = cloneDeep(fixturesExtendedReport);
    fixtures.results.report_json.entries[0].detail?.remediations?.push({
      type: 'info',
      context: 'Some info remediation.',
    });
    const result = parseJobReport(fixtures);

    expect(result).toHaveLength(9);
    expect(
      result.some(
        ({ issue_parsed }) =>
          issue_parsed.remediationContext === 'Some info remediation.'
      )
    ).toBeTruthy();
  });

  it('parses issue diagnosis for the extended report', () => {
    const fixtures = cloneDeep(fixturesExtendedReport);
    fixtures.results.report_json.entries[0].detail?.remediations?.push({
      type: 'info',
      context: 'Some info remediation.',
    });
    fixtures.results.report_json.entries[0].detail = {
      ...fixtures.results.report_json.entries[0].detail,
      diagnosis: { context: 'Test diagnosis text.' },
    };
    const result = parseJobReport(fixtures);

    expect(result).toHaveLength(9);
    expect(
      result.filter(
        ({ issue_parsed }) => issue_parsed.diagnosis === 'Test diagnosis text.'
      )
    ).toHaveLength(2);
  });
});

describe('prepareItems', () => {
  it('should prepare items with report_json', () => {
    const parsed = prepareItems([fixturesPlainReport, fixturesExtendedReport]);

    expect(parsed).toHaveLength(9);
  });
});
