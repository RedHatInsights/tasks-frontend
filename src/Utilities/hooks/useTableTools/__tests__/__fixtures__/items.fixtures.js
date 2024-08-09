export default [
  {
    task_title: 'taskA',
    task_slug: 'taska',
    id: 1,
    start_time: '2022-04-20T10:10:00',
    end_time: '2022-04-20T11:10:00',
    run_date_time: '20 Apr 2022, 11:10 UTC',
    initiated_by: 'Michael',
    status: 'Completed',
    systems_count: 10,
  },
  {
    task_title: 'taskB',
    task_slug: 'taskb',
    id: 2,
    start_time: '2022-04-21T10:10:00',
    end_time: 'null',
    run_date_time: 'Running',
    initiated_by: 'Michael',
    status: 'Running',
    systems_count: 5,
  },
  {
    task_title: 'special one',
    start_time: '2022-04\n57\nhehe","break!',
    systems_count: 42,
  },
  {
    task_title: 'another one with unexpected array',
    start_time: [42, 'abc'],
    systems_count: 10,
  },
];
