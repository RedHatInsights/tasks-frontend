const parameters = [
  {
    default: null,
    description: 'a file path needed by the playbook',
    key: 'path',
    required: true,
  },
  {
    default: 'This is the default',
    description: 'This is your help text',
    key: 'this-is-your-label',
    required: true,
  },
  {
    default: null,
    description:
      'Add the following tags to systems. You can add more by using commas.',
    key: 'Add_Tags',
    required: false,
  },
  {
    default: null,
    description:
      'Remove the following tags to systems if they match exactly something found. You can add more by using commas.',
    key: 'Remove_Tags',
    required: false,
  },
  {
    default: null,
    description: 'This is more help text',
    key: 'blah',
    required: false,
  },
];

const pathFilledParameters = [
  {
    key: 'path',
    validated: true,
    value: 'bogus/path',
  },
  {
    key: 'this-is-your-label',
    validated: true,
    value: 'This is the default',
  },
  {
    key: 'Add_Tags',
  },
  {
    key: 'Remove_Tags',
  },
  {
    key: 'blah',
  },
];

export default {
  parameters,
  pathFilledParameters,
};
