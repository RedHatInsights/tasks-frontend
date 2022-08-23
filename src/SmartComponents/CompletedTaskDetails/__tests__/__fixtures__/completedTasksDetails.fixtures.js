export const log4j_task = {
  id: 42,
  task_title: 'Log4J Detection',
  task_slug: 'log4j',
  description:
    'Uses the insights-client to determine if systems are affected by the LogShell vulnerability. Resource intensive scan',
  task_url: 'https://console.redhat.com/api/tasks/v1/task/log4J',
  start_time: '2022-04-21T10:10:00',
  end_time: null,
  initiated_by: 'UserX',
  status: 'Completed',
  system_count: 10,
  jobs: [
    {
      display_name: 'host01.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeeff',
      message: 'Vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host02.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefg',
      message: 'No vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host03.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefh',
      message: 'No vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host04.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefi',
      message: 'Vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host05.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefj',
      message: 'Vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host06.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefk',
      message: 'No vulnerability found.',
      status: 'completed',
    },
  ],
};

export const log4j_task_jobs = [
  {
    executed_task: 234,
    system: 'f1356a99-754d-4219-9g25-fccb2cc6e2f2',
    status: 'Success',
    results: {},
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'dl-test-device-2',
  },
  {
    executed_task: 234,
    system: '3262b268-23ed-4c5a-a918-d8c4923fdfbf',
    status: 'Failure',
    results: {},
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'MG-test-device',
  },
  {
    executed_task: 234,
    system: '42438801-c384-491a-943b-f5f621f0c882',
    status: 'Running',
    results: {},
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'YL-test-device-85',
  },
];

export const upgrade_leap_task = {
  id: 43,
  task_title: 'Upgrade RHEL version with LEAP tool',
  description:
    'Uses the insights-client to determine if RHEL version can be upgraded with LEAP tool. Resource intensive scan',
  task_url: 'https://console.redhat.com/api/tasks/v1/task/leap',
  start: '2022-04-21T10:10:00',
  end: '2022-04-23T11:10:00',
  initiated_by: 'Michael',
  status: 'running',
  system_count: 5,
  jobs: [
    {
      display_name: 'host01.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeeff',
      message: 'Vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host02.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefg',
      message: 'No vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host03.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefh',
      message: 'No vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host04.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefi',
      message: 'Vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host05.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefj',
      message: 'Vulnerability found.',
      status: 'completed',
    },
    {
      display_name: 'host06.example.com',
      system_id: '00112233-4455-6677-8899aabbccddeefk',
      message: 'No vulnerability found.',
      status: 'completed',
    },
  ],
};
