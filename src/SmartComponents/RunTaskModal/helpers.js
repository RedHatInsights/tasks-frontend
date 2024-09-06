export const findParameterByKey = (parameters, key) => {
  return parameters.find((param) => param.key === key);
};

export const toBool = (value) => {
  return value?.toLowerCase() === 'true' || value === '1' || value === 1;
};

const isTextbox = (parameter) => (parameter?.values || []).length === 0;

const isCheckbox = (parameter) =>
  parameter.values.length === 2 &&
  (parameter.values.every((value) =>
    ['true', 'false'].includes(value.toLowerCase())
  ) ||
    parameter.values.every((value) => ['0', '1'].includes(value)));

const isMultiSelect = (parameter) => parameter.multi_valued;

// This will likely change when the Tasks backend supports Data Driven Forms
export const getInputParameterType = (parameter) => {
  switch (true) {
    case isCheckbox(parameter):
      return 'checkbox';
    case isTextbox(parameter):
      return 'textbox';
    case isMultiSelect(parameter):
      return 'multiselect';
    default:
      return 'dropdown';
  }
};
