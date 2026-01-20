import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParameterMultiSelect from '../ParameterMultiSelect';

describe('ParameterMultiSelect', () => {
  let mockUpdateParameter;
  let defaultParameter;

  beforeEach(() => {
    mockUpdateParameter = jest.fn();
    defaultParameter = {
      key: 'test-multiselect',
      title: 'Test Multi Select',
      description: 'Select one or more options',
      values: ['Option1', 'Option2', 'Option3'],
      required: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    render(
      <ParameterMultiSelect
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(screen.getByText('Test Multi Select')).toBeInTheDocument();
    expect(screen.getByText('Select one or more options')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Select Test Multi Select/i })
    ).toBeInTheDocument();
  });

  it('should render with custom description', () => {
    const customDescription = 'Custom description for multi-select';

    render(
      <ParameterMultiSelect
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
        customDescription={customDescription}
      />
    );

    expect(screen.getByText(customDescription)).toBeInTheDocument();
    expect(
      screen.queryByText('Select one or more options')
    ).not.toBeInTheDocument();
  });

  it('should render with parameter.key when title is not provided', () => {
    const paramWithoutTitle = {
      ...defaultParameter,
      title: undefined,
    };

    render(
      <ParameterMultiSelect
        parameter={paramWithoutTitle}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(screen.getByText('test-multiselect')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Select test-multiselect/i })
    ).toBeInTheDocument();
  });

  it('should open and close dropdown on toggle click', async () => {
    render(
      <ParameterMultiSelect
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const toggle = screen.getByRole('button', {
      name: /Select Test Multi Select/i,
    });

    // Open dropdown
    await userEvent.click(toggle);
    await waitFor(() => {
      expect(
        screen.getByRole('menuitem', { name: 'Option1' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: 'Option2' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: 'Option3' })
      ).toBeInTheDocument();
    });

    // Close dropdown
    await userEvent.click(toggle);
    await waitFor(() => {
      expect(
        screen.queryByRole('menuitem', { name: 'Option1' })
      ).not.toBeInTheDocument();
    });
  });

  it('should select an option and call updateParameter', async () => {
    render(
      <ParameterMultiSelect
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const toggle = screen.getByRole('button', {
      name: /Select Test Multi Select/i,
    });
    await userEvent.click(toggle);

    // Find the menuitem and click the checkbox inside it
    const option1Menuitem = await screen.findByRole('menuitem', {
      name: 'Option1',
    });
    const checkbox = within(option1Menuitem).getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(mockUpdateParameter).toHaveBeenCalledWith(
      defaultParameter,
      'Option1'
    );
  });

  it('should select multiple options and call updateParameter with comma-separated values', async () => {
    render(
      <ParameterMultiSelect
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const toggle = screen.getByRole('button', {
      name: /Select Test Multi Select/i,
    });

    // Select first option
    await userEvent.click(toggle);
    const option1Menuitem = await screen.findByRole('menuitem', {
      name: 'Option1',
    });
    const checkbox1 = within(option1Menuitem).getByRole('checkbox');
    await userEvent.click(checkbox1);
    expect(mockUpdateParameter).toHaveBeenCalledWith(
      defaultParameter,
      'Option1'
    );

    // Select second option
    const option2Menuitem = await screen.findByRole('menuitem', {
      name: 'Option2',
    });
    const checkbox2 = within(option2Menuitem).getByRole('checkbox');
    await userEvent.click(checkbox2);
    expect(mockUpdateParameter).toHaveBeenCalledWith(
      defaultParameter,
      'Option1,Option2'
    );

    // Select third option
    const option3Menuitem = await screen.findByRole('menuitem', {
      name: 'Option3',
    });
    const checkbox3 = within(option3Menuitem).getByRole('checkbox');
    await userEvent.click(checkbox3);
    expect(mockUpdateParameter).toHaveBeenCalledWith(
      defaultParameter,
      'Option1,Option2,Option3'
    );
  });

  it('should deselect an option', async () => {
    render(
      <ParameterMultiSelect
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const toggle = screen.getByRole('button', {
      name: /Select Test Multi Select/i,
    });

    // Select two options
    await userEvent.click(toggle);
    const option1Menuitem = await screen.findByRole('menuitem', {
      name: 'Option1',
    });
    const checkbox1 = within(option1Menuitem).getByRole('checkbox');
    await userEvent.click(checkbox1);

    const option2Menuitem = await screen.findByRole('menuitem', {
      name: 'Option2',
    });
    const checkbox2 = within(option2Menuitem).getByRole('checkbox');
    await userEvent.click(checkbox2);
    expect(mockUpdateParameter).toHaveBeenCalledWith(
      defaultParameter,
      'Option1,Option2'
    );

    // Deselect first option
    await userEvent.click(checkbox1);
    expect(mockUpdateParameter).toHaveBeenCalledWith(
      defaultParameter,
      'Option2'
    );
  });

  it('should call updateParameter with "None" when all options are deselected', async () => {
    render(
      <ParameterMultiSelect
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const toggle = screen.getByRole('button', {
      name: /Select Test Multi Select/i,
    });

    // Select one option
    await userEvent.click(toggle);
    const option1Menuitem = await screen.findByRole('menuitem', {
      name: 'Option1',
    });
    const checkbox1 = within(option1Menuitem).getByRole('checkbox');
    await userEvent.click(checkbox1);
    expect(mockUpdateParameter).toHaveBeenCalledWith(
      defaultParameter,
      'Option1'
    );

    // Deselect it
    await userEvent.click(checkbox1);
    expect(mockUpdateParameter).toHaveBeenCalledWith(defaultParameter, 'None');
  });

  it('should show badge with count when options are selected', async () => {
    const { container } = render(
      <ParameterMultiSelect
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const toggle = screen.getByRole('button', {
      name: /Select Test Multi Select/i,
    });

    // Initially no badge
    expect(container.querySelector('.pf-v6-c-badge')).not.toBeInTheDocument();

    // Select one option
    await userEvent.click(toggle);
    const option1Menuitem = await screen.findByRole('menuitem', {
      name: 'Option1',
    });
    const checkbox1 = within(option1Menuitem).getByRole('checkbox');
    await userEvent.click(checkbox1);

    // Badge should show count of 1
    await waitFor(() => {
      const badge = container.querySelector('.pf-v6-c-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('1');
    });

    // Select another option
    const option2Menuitem = await screen.findByRole('menuitem', {
      name: 'Option2',
    });
    const checkbox2 = within(option2Menuitem).getByRole('checkbox');
    await userEvent.click(checkbox2);

    // Badge should show count of 2
    await waitFor(() => {
      const badge = container.querySelector('.pf-v6-c-badge');
      expect(badge).toHaveTextContent('2');
    });
  });

  it('should filter out "None" from values', async () => {
    const parameterWithNone = {
      ...defaultParameter,
      values: ['Option1', 'None', 'Option2'],
    };

    render(
      <ParameterMultiSelect
        parameter={parameterWithNone}
        updateParameter={mockUpdateParameter}
      />
    );

    const toggle = screen.getByRole('button', {
      name: /Select Test Multi Select/i,
    });
    await userEvent.click(toggle);

    await waitFor(() => {
      expect(
        screen.getByRole('menuitem', { name: 'Option1' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: 'Option2' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('menuitem', { name: 'None' })
      ).not.toBeInTheDocument();
    });
  });

  it('should mark field as required when parameter.required is true', () => {
    const requiredParameter = {
      ...defaultParameter,
      required: true,
    };

    const { container } = render(
      <ParameterMultiSelect
        parameter={requiredParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    const formGroup = container.querySelector('.pf-v6-c-form__group');
    expect(formGroup).toBeInTheDocument();

    const requiredIndicator = container.querySelector(
      '.pf-v6-c-form__label-required'
    );
    expect(requiredIndicator).toBeInTheDocument();
  });

  it('should have correct PatternFly v6 structure', () => {
    const { container } = render(
      <ParameterMultiSelect
        parameter={defaultParameter}
        updateParameter={mockUpdateParameter}
      />
    );

    expect(container.querySelector('.pf-v6-c-form__group')).toBeInTheDocument();
    expect(container.querySelector('.pf-v6-c-menu-toggle')).toBeInTheDocument();
    expect(container.querySelector('.pf-v6-c-helper-text')).toBeInTheDocument();
  });
});
