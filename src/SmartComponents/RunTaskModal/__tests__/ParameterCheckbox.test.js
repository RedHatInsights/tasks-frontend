import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParameterCheckbox from '../ParameterCheckbox';

describe('ParameterCheckbox', () => {
  let mockUpdateParameter;
  let defaultParameter;

  beforeEach(() => {
    mockUpdateParameter = jest.fn();
    defaultParameter = {
      key: 'test-checkbox',
      title: 'Test Checkbox',
      description: 'This is a test checkbox',
      default: 'False',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    render(
      <ParameterCheckbox
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(screen.getByLabelText('test-checkbox')).toBeInTheDocument();
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    expect(screen.getByText('This is a test checkbox')).toBeInTheDocument();
  });

  it('should render with parameter.key as label when title is not provided', () => {
    const paramWithoutTitle = {
      ...defaultParameter,
      title: undefined,
    };

    render(
      <ParameterCheckbox
        parameter={paramWithoutTitle}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(screen.getByText('test-checkbox')).toBeInTheDocument();
  });

  it('should render with custom description', () => {
    const customDescription = 'Custom description text';

    render(
      <ParameterCheckbox
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
        customDescription={customDescription}
      />
    );

    expect(screen.getByText(customDescription)).toBeInTheDocument();
    expect(screen.queryByText('This is a test checkbox')).not.toBeInTheDocument();
  });

  it('should be unchecked when default is False', () => {
    render(
      <ParameterCheckbox
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox = screen.getByLabelText('test-checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should be checked when default is True', () => {
    const checkedParameter = {
      ...defaultParameter,
      default: 'True',
    };

    render(
      <ParameterCheckbox
        parameter={checkedParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox = screen.getByLabelText('test-checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should handle True/False values when toggled', async () => {
    render(
      <ParameterCheckbox
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox = screen.getByLabelText('test-checkbox');

    // Click to check
    await userEvent.click(checkbox);
    expect(mockUpdateParameter).toHaveBeenCalledWith(defaultParameter, 'True');
    expect(checkbox).toBeChecked();

    // Click to uncheck
    await userEvent.click(checkbox);
    expect(mockUpdateParameter).toHaveBeenCalledWith(defaultParameter, 'False');
    expect(checkbox).not.toBeChecked();
  });

  it('should handle 0/1 values when default is "0"', async () => {
    const numericParameter = {
      ...defaultParameter,
      default: '0',
    };

    render(
      <ParameterCheckbox
        parameter={numericParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox = screen.getByLabelText('test-checkbox');

    // Click to check
    await userEvent.click(checkbox);
    expect(mockUpdateParameter).toHaveBeenCalledWith(numericParameter, '1');
    expect(checkbox).toBeChecked();
  });

  it('should handle 0/1 values when default is "1"', async () => {
    const numericParameter = {
      ...defaultParameter,
      default: '1',
    };

    render(
      <ParameterCheckbox
        parameter={numericParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox = screen.getByLabelText('test-checkbox');
    expect(checkbox).toBeChecked();

    // Click to uncheck
    await userEvent.click(checkbox);
    expect(mockUpdateParameter).toHaveBeenCalledWith(numericParameter, '0');
    expect(checkbox).not.toBeChecked();
  });

  it('should use correct PatternFly v6 attributes', () => {
    const { container } = render(
      <ParameterCheckbox
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox = screen.getByLabelText('test-checkbox');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'test-checkbox');

    const checkboxLabel = container.querySelector('.pf-v6-c-check__label');
    expect(checkboxLabel).toBeInTheDocument();
  });
});
