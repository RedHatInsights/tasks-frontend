import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParameterCheckboxGroup from '../ParameterCheckboxGroup';

describe('ParameterCheckboxGroup', () => {
  let mockUpdateParameter;
  let defaultParameter;

  beforeEach(() => {
    mockUpdateParameter = jest.fn();
    defaultParameter = {
      key: 'test-checkbox-group',
      title: 'Test Checkbox Group',
      description: 'Select one or more options',
      values: ['Option1', 'Option2', 'Option3'],
      default: 'None',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    render(
      <ParameterCheckboxGroup
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(screen.getByText('Test Checkbox Group')).toBeInTheDocument();
    expect(screen.getByText('Select one or more options')).toBeInTheDocument();
    expect(screen.getByLabelText('test-checkbox-group.Option1')).toBeInTheDocument();
    expect(screen.getByLabelText('test-checkbox-group.Option2')).toBeInTheDocument();
    expect(screen.getByLabelText('test-checkbox-group.Option3')).toBeInTheDocument();
  });

  it('should render with custom description', () => {
    const customDescription = 'Custom description for checkbox group';

    render(
      <ParameterCheckboxGroup
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
        customDescription={customDescription}
      />
    );

    expect(screen.getByText(customDescription)).toBeInTheDocument();
    expect(screen.queryByText('Select one or more options')).not.toBeInTheDocument();
  });

  it('should have no checkboxes checked when default is "None"', () => {
    render(
      <ParameterCheckboxGroup
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(screen.getByLabelText('test-checkbox-group.Option1')).not.toBeChecked();
    expect(screen.getByLabelText('test-checkbox-group.Option2')).not.toBeChecked();
    expect(screen.getByLabelText('test-checkbox-group.Option3')).not.toBeChecked();
  });

  it('should have no checkboxes checked when default is empty string', () => {
    const parameterWithEmptyDefault = {
      ...defaultParameter,
      default: '',
    };

    render(
      <ParameterCheckboxGroup
        parameter={parameterWithEmptyDefault}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(screen.getByLabelText('test-checkbox-group.Option1')).not.toBeChecked();
    expect(screen.getByLabelText('test-checkbox-group.Option2')).not.toBeChecked();
    expect(screen.getByLabelText('test-checkbox-group.Option3')).not.toBeChecked();
  });

  it('should have correct checkboxes checked when default has values', () => {
    const parameterWithDefaults = {
      ...defaultParameter,
      default: 'Option1,Option3',
    };

    render(
      <ParameterCheckboxGroup
        parameter={parameterWithDefaults}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(screen.getByLabelText('test-checkbox-group.Option1')).toBeChecked();
    expect(screen.getByLabelText('test-checkbox-group.Option2')).not.toBeChecked();
    expect(screen.getByLabelText('test-checkbox-group.Option3')).toBeChecked();
  });

  it('should call updateParameter when checking a checkbox', async () => {
    render(
      <ParameterCheckboxGroup
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox1 = screen.getByLabelText('test-checkbox-group.Option1');
    await userEvent.click(checkbox1);

    expect(mockUpdateParameter).toHaveBeenCalledWith(defaultParameter, 'Option1');
    expect(checkbox1).toBeChecked();
  });

  it('should call updateParameter with comma-separated values when multiple checkboxes are checked', async () => {
    render(
      <ParameterCheckboxGroup
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox1 = screen.getByLabelText('test-checkbox-group.Option1');
    const checkbox2 = screen.getByLabelText('test-checkbox-group.Option2');

    await userEvent.click(checkbox1);
    expect(mockUpdateParameter).toHaveBeenCalledWith(defaultParameter, 'Option1');

    await userEvent.click(checkbox2);
    expect(mockUpdateParameter).toHaveBeenCalledWith(defaultParameter, 'Option1,Option2');

    expect(checkbox1).toBeChecked();
    expect(checkbox2).toBeChecked();
  });

  it('should call updateParameter with "None" when last checkbox is unchecked', async () => {
    const parameterWithOneChecked = {
      ...defaultParameter,
      default: 'Option1',
    };

    render(
      <ParameterCheckboxGroup
        parameter={parameterWithOneChecked}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox1 = screen.getByLabelText('test-checkbox-group.Option1');
    expect(checkbox1).toBeChecked();

    await userEvent.click(checkbox1);
    expect(mockUpdateParameter).toHaveBeenCalledWith(parameterWithOneChecked, 'None');
    expect(checkbox1).not.toBeChecked();
  });

  it('should not render checkboxes for "None" or empty string values', () => {
    const parameterWithNoneAndEmpty = {
      ...defaultParameter,
      values: ['Option1', 'None', '', 'Option2'],
    };

    render(
      <ParameterCheckboxGroup
        parameter={parameterWithNoneAndEmpty}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(screen.getByLabelText('test-checkbox-group.Option1')).toBeInTheDocument();
    expect(screen.getByLabelText('test-checkbox-group.Option2')).toBeInTheDocument();
    expect(screen.queryByLabelText('test-checkbox-group.None')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('test-checkbox-group.')).not.toBeInTheDocument();
  });

  it('should have correct ARIA attributes and PatternFly v6 structure', () => {
    const { container } = render(
      <ParameterCheckboxGroup
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const formGroup = container.querySelector('[role="group"]');
    expect(formGroup).toBeInTheDocument();

    const checkboxLabels = container.querySelectorAll('.pf-v6-c-check__label');
    expect(checkboxLabels.length).toBe(3); // 3 options
  });

  it('should handle unchecking a checkbox from a multi-selection', async () => {
    const parameterWithMultipleChecked = {
      ...defaultParameter,
      default: 'Option1,Option2,Option3',
    };

    render(
      <ParameterCheckboxGroup
        parameter={parameterWithMultipleChecked}
        updateParameter={mockUpdateParameter}
      />
    );

    const checkbox2 = screen.getByLabelText('test-checkbox-group.Option2');
    expect(checkbox2).toBeChecked();

    await userEvent.click(checkbox2);
    expect(mockUpdateParameter).toHaveBeenCalledWith(parameterWithMultipleChecked, 'Option1,Option3');
    expect(checkbox2).not.toBeChecked();
  });
});
