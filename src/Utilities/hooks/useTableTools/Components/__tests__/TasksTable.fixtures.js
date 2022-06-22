export const completedTasksTableItems = [
  {
    title: 'taskA',
    id: 1,
    start: '2022-04-21T10:10:00',
    end: 'null',
    run_date_time: 'Running',
    initiated_by: 'Michael',
    status: 'running',
    system_count: 10,
  },
  {
    title: 'taskB',
    id: 2,
    start: '2022-04-20T10:10:00',
    end: '2022-04-20T11:10:00',
    run_date_time: '20 Apr 2022, 11:10 UTC',
    initiated_by: 'Michael',
    status: 'complete',
    system_count: 5,
  },
];

export const availableTasksTableError = {
  response: {
    status: 404,
  },
  message: 'Error',
};

export const availableTasksTableItems = [
  {
    title: 'taskA',
    slug: 'taska',
    description:
      'Uses the insights-client to determine if systems are affected by the LogShell vulnerability. Resource intensive scan',
    published_date: '2022-01-01T13:45',
    severity: 'critical',
  },
  {
    title: 'taskB',
    slug: 'taskb',
    description:
      'Uses the insights-client to determine if RHEL version can be upgraded with LEAP tool. Resource intensive scan',
    published_date: '2021-10-13T00:00',
    severity: 'moderate',
  },
];

export const completedTaskJobsItems = [
  {
    id: 82,
    display_name: 'host01.example.com',
    host_id: '00112233-4455-6677-8899aabbccddeeff',
    message: 'Vulnerability found.',
    status: 'completed',
  },
  {
    id: 83,
    display_name: 'host02.example.com',
    host_id: '00112233-4455-6677-8899aabbccddeefg',
    message: 'No vulnerability found.',
    status: 'completed',
  },
  {
    id: 84,
    display_name: 'host03.example.com',
    host_id: '00112233-4455-6677-8899aabbccddeefh',
    message: 'No vulnerability found.',
    status: 'completed',
  },
  {
    id: 85,
    display_name: 'host04.example.com',
    host_id: '00112233-4455-6677-8899aabbccddeefi',
    message: 'Vulnerability found.',
    status: 'completed',
  },
  {
    id: 86,
    display_name: 'host05.example.com',
    host_id: '00112233-4455-6677-8899aabbccddeefj',
    message: 'Vulnerability found.',
    status: 'completed',
  },
  {
    id: 87,
    display_name: 'host06.example.com',
    host_id: '00112233-4455-6677-8899aabbccddeefk',
    message: 'No vulnerability found.',
    status: 'completed',
  },
];
