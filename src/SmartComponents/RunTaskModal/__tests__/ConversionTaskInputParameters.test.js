import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConversionTaskInputParameters from '../ConversionTaskInputParameters';

describe('ConversionTaskInputParameters', () => {
  let mockSetDefinedParameters;
  let defaultParameters;

  beforeEach(() => {
    mockSetDefinedParameters = jest.fn();
    defaultParameters = [
      { key: 'ELS_DISABLED', title: 'ELS Disabled', description: 'Enable ELS', values: ['True', 'False'], default: 'False' },
      { key: 'CONVERT2RHEL_ALLOW_UNAVAILABLE_KMODS', title: 'Allow unavailable kmods', description: 'Allow unavailable kernel modules', values: ['True', 'False'], default: 'False' },
      { key: 'CONVERT2RHEL_SKIP_KERNEL_CURRENCY_CHECK', title: 'Skip kernel currency check', description: 'Skip checking kernel', values: ['True', 'False'], default: 'False' },
      { key: 'CONVERT2RHEL_OUTDATED_PACKAGE_CHECK_SKIP', title: 'Skip outdated package check', description: 'Skip outdated packages', values: ['True', 'False'], default: 'False' },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with conversion title and description when slug contains conversion', () => {
    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    expect(screen.getByText('Convert to RHEL 7 without Extended Lifecycle Support (ELS)')).toBeInTheDocument();
    expect(screen.getByText(/By default, the task converts your CentOS Linux 7/i)).toBeInTheDocument();
  });

  it('should render with analysis title and description when slug contains analysis', () => {
    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-analysis"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    expect(screen.getByText('Analyze conversion to RHEL 7 without Extended Lifecycle Support (ELS)')).toBeInTheDocument();
    expect(screen.getByText(/By default, the task analyzes a conversion of your CentOS Linux 7/i)).toBeInTheDocument();
  });

  it('should render all required checkboxes', () => {
    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    // ELS_DISABLED checkbox
    expect(screen.getByLabelText('ELS_DISABLED')).toBeInTheDocument();

    // CONVERT2RHEL_ALLOW_UNAVAILABLE_KMODS checkbox
    expect(screen.getByLabelText('CONVERT2RHEL_ALLOW_UNAVAILABLE_KMODS')).toBeInTheDocument();

    // CONVERT2RHEL_SKIP_KERNEL_CURRENCY_CHECK checkbox
    expect(screen.getByLabelText('CONVERT2RHEL_SKIP_KERNEL_CURRENCY_CHECK')).toBeInTheDocument();

    // CONVERT2RHEL_OUTDATED_PACKAGE_CHECK_SKIP checkbox
    expect(screen.getByLabelText('CONVERT2RHEL_OUTDATED_PACKAGE_CHECK_SKIP')).toBeInTheDocument();
  });

  it('should render warning alert', () => {
    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    expect(screen.getByText('Resolve issues if possible')).toBeInTheDocument();
    expect(screen.getByText(/Use these at your discretion and resolve the issues if possible/i)).toBeInTheDocument();
  });

  it('should render optional skipTaintedKernelModuleCheck when present', () => {
    const parametersWithTainted = [
      ...defaultParameters,
      { key: 'CONVERT2RHEL_TAINTED_KERNEL_MODULE_CHECK_SKIP', title: 'Skip tainted kernel module check', description: 'Skip tainted modules', values: ['True', 'False'], default: 'False' },
    ];

    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={parametersWithTainted}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    expect(screen.getByLabelText('CONVERT2RHEL_TAINTED_KERNEL_MODULE_CHECK_SKIP')).toBeInTheDocument();
  });

  it('should not render skipTaintedKernelModuleCheck when not present', () => {
    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    expect(screen.queryByLabelText('CONVERT2RHEL_TAINTED_KERNEL_MODULE_CHECK_SKIP')).not.toBeInTheDocument();
  });

  it('should render optional optionalRepositories when present', () => {
    const parametersWithRepos = [
      ...defaultParameters,
      { key: 'OPTIONAL_REPOSITORIES', title: 'Optional Repositories', description: 'Select repositories', values: ['Repo1', 'Repo2', 'Repo3'], default: 'None' },
    ];

    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={parametersWithRepos}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    expect(screen.getByText('Optional Repositories')).toBeInTheDocument();
  });

  it('should not render optionalRepositories when not present', () => {
    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    expect(screen.queryByText('Optional Repositories')).not.toBeInTheDocument();
  });

  it('should call setDefinedParameters when checkbox is toggled', async () => {
    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    const checkbox = screen.getByLabelText('ELS_DISABLED');
    await userEvent.click(checkbox);

    expect(mockSetDefinedParameters).toHaveBeenCalled();

    // Verify the callback updates the parameter correctly
    const updateCallback = mockSetDefinedParameters.mock.calls[0][0];
    const mockPrevState = [
      { key: 'ELS_DISABLED', value: 'False' },
      { key: 'OTHER_PARAM', value: 'SomeValue' },
    ];

    const updatedState = updateCallback(mockPrevState);
    expect(updatedState).toEqual([
      { key: 'ELS_DISABLED', value: 'True' },
      { key: 'OTHER_PARAM', value: 'SomeValue' },
    ]);
  });

  it('should render section title for ignore checks', () => {
    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    expect(screen.getByText('Ignore specific pre-conversion analysis check results.')).toBeInTheDocument();
  });

  it('should use custom descriptions for specific parameters', () => {
    render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    // ELS_DISABLED should have custom description
    expect(screen.getByText(/If you plan to upgrade to RHEL 8 right after the conversion/i)).toBeInTheDocument();

    // CONVERT2RHEL_ALLOW_UNAVAILABLE_KMODS should have custom description
    expect(screen.getByText(/We cannot guarantee that the loaded kernel modules/i)).toBeInTheDocument();
  });

  it('should have correct PatternFly v6 structure', () => {
    const { container } = render(
      <ConversionTaskInputParameters
        slug="convert-to-rhel-conversion"
        parameters={defaultParameters}
        setDefinedParameters={mockSetDefinedParameters}
      />
    );

    expect(container.querySelector('.pf-v6-c-form')).toBeInTheDocument();
    expect(container.querySelector('.pf-v6-c-alert')).toBeInTheDocument();
    expect(container.querySelector('.pf-v6-c-alert.pf-m-warning')).toBeInTheDocument();
  });
});
