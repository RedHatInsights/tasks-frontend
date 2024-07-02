export const fixturesPlainReport = {
  display_name: 'host_abc',
  status: 'Success',
  results: {
    report:
      'Lorem ipsum dolor sit amet, "consectetuer" adipiscing elit. Maecenas fermentum, sem in pharetra pellentesque, velit turpis > !volutpat ante, in pharetra metus odio a lectus. ',
    message: 'Lorem ipsum dolor sit amet',
  },
};

export const fixturesExtendedReport = {
  display_name: 'host_abc',
  status: 'Success',
  results: {
    report:
      'Lorem ipsum dolor sit amet, "consectetuer" adipiscing elit. Maecenas fermentum, sem in pharetra pellentesque, velit turpis > !volutpat ante, in pharetra metus odio a lectus. ',
    message: 'Lorem ipsum dolor sit amet',
    report_json: {
      entries: [
        {
          title: 'Some issue title',
          severity: 'info',
          key: 'test_issue_key',
          summary: 'some summary',
          detail: {
            remediations: [
              {
                type: 'hint',
                context: 'Some description of remediation step',
              },
              {
                type: 'warning',
                context: 'Some description of another remediation step',
              },
            ],
            diagnosis: {
              context: 'Some diagnosis report',
            },
          },
        },
      ],
    },
  },
};
