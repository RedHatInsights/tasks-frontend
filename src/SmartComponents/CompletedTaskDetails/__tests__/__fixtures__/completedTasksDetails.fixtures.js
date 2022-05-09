export const log4j_task = {
  id: 42,
  task_title: 'Log4J Detection',
  description:
    'Uses the insights-client to determine if systems are affected by the LogShell vulnerability. Resource intensive scan',
  task_url: 'https://console.redhat.com/api/tasks/v1/task/log4J',
  start: '2022-04-21T10:10:00',
  end: null,
  initiated_by: 'UserX',
  status: 'running',
  system_count: 10,
  jobs: [
    {
      display_name: 'host01.example.com',
      host_id: '00112233-4455-6677-8899aabbccddeeff',
      status: 'completed',
      //results: {'JSON structure'}
    },
  ],
};

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
      host_id: '00112233-4455-6677-8899aabbccddeeff',
      status: 'completed',
      //results: {'JSON structure'}
    },
  ],
};
