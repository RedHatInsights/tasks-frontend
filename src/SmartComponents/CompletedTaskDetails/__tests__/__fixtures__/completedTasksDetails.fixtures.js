export const log4j_task = {
  id: 42,
  task_title: 'Log4J Detection',
  task_slug: 'log4j',
  task_description:
    'Uses the insights-client to determine if systems are affected by the LogShell vulnerability. Resource intensive scan',
  start_time: '2022-04-21T10:10:00',
  end_time: '2022-04-25T10:10:00',
  initiated_by: 'UserX',
  status: 'Completed',
  system_count: 3,
  systems_count: 3,
};

export const log4j_task_jobs = [
  {
    executed_task: 234,
    system: 'f1356a99-754d-4219-9g25-fccb2cc6e2f2',
    status: 'Success',
    results: {
      message: 'This was a success.',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'dl-test-device-2',
  },
  {
    executed_task: 234,
    system: '3262b268-23ed-4c5a-a918-d8c4923fdfbf',
    status: 'Failure',
    results: {
      message: 'This was a failure.',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'MG-test-device',
  },
  {
    executed_task: 234,
    system: '42438801-c384-491a-943b-f5f621f0c882',
    status: 'Timeout',
    results: {
      message: 'This timed out. Whoops!',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'YL-test-device-85',
  },
];

export const upgrade_leapp_task = {
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
};

export const leapp_task_jobs = [
  {
    executed_task: 235,
    system: 'f1356a99-754d-4219-9g25-fccb2cc6e2f2',
    status: 'Success',
    results: {},
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'dl-test-device-2',
  },
  {
    executed_task: 235,
    system: 'f1356a99-754d-4219-9g25-fccb2cc53bee',
    status: 'Success',
    results: {
      alert: true,
      message: 'Your system has 2 inhibitors out of 5 potential problems',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'dl-test-device-3',
  },
  {
    executed_task: 235,
    system: '3262b268-23ed-4c5a-a918-d8c4923fdfbf',
    status: 'Failure',
    results: {
      message: 'This was a failure.',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'MG-test-device',
  },
  {
    executed_task: 235,
    system: '42438801-c384-491a-943b-f5f621f0c882',
    status: 'Timeout',
    results: {
      message: 'This timed out. Whoops!',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'YL-test-device-85',
  },
  {
    executed_task: 235,
    system: 'f1356a99-754d-4219-9g25-fccb2cf29c99',
    status: 'Success',
    results: {
      alert: true,
      message: 'Your system has 1 inhibitor out of 3 potential problems',
      report:
        'Risk Factor: high\nTitle: Leapp could not identify where GRUB core is located\nSummary: We assume GRUB core is located on the same device as /boot. Leapp needs to update GRUB core as it is not done automatically on legacy (BIOS) systems. \nRemediation: [hint] Please run "grub2-install <GRUB_DEVICE> command manually after upgrade\nKey: ca7a1a66906a7df3da890aa538562708d3ea6ecd\n----------------------------------------\nRisk Factor: low\nTitle: SElinux will be set to permissive mode\nSummary: SElinux will be set to permissive mode. Current mode: enforcing. This action is required by the upgrade process to make sure the upgraded system can boot without beinig blocked by SElinux rules.\nRemediation: [hint] Make sure there are no SElinux related warnings after the upgrade and enable SElinux manually afterwards. Notice: You can ignore the "/root/tmp_leapp_py3" SElinux warnings.\nKey: 39d7183dafba798aa4bbb1e70b0ef2bbe5b1772f\n----------------------------------------\nRisk Factor: low\nTitle: The subscription-manager release is going to be set after the upgrade\nSummary: After the upgrade has completed the release of the subscription-manager will be set to 9.0. This will ensure that you will receive and keep the version you choose to upgrade to.\nRemediation: [hint] If you wish to receive updates for the latest released version of the target system, run `subscription-manager release --unset` after the upgrade.\nKey: 747a4ca25303eda17d1891bb85eeb226be14f252\n----------------------------------------\nRisk Factor: info\nTitle: SElinux relabeling will be scheduled\nSummary: SElinux relabeling will be scheduled as the status is permissive/enforcing.\nKey: 8fb81863f8413bd617c2a55b69b8e10ff03d7c72\n----------------------------------------\n',
      report_json: {
        entries: [
          {
            id: 'c5a74566244db3b2a9e6570302b4cb61af9c3ad0a60d2433975881f823cb06dd',
            key: 'ca7a1a66906a7df3da890aa538562708d3ea6ecd',
            tags: ['boot'],
            actor: 'check_grub_core',
            title: 'Leapp could not identify where GRUB core is located',
            detail: {
              remediations: [
                {
                  type: 'hint',
                  context:
                    'Please run "grub2-install <GRUB_DEVICE> command manually after upgrade',
                },
              ],
            },
            summary:
              'We assume GRUB core is located on the same device as /boot. Leapp needs to update GRUB core as it is not done automatically on legacy (BIOS) systems. ',
            audience: 'sysadmin',
            hostname: 'ectask',
            severity: 'high',
            timeStamp: '2022-11-01T17:50:11.770227Z',
          },
          {
            id: '2008eeb7882bd0fe8f35b524582a017ba2bac1ac4ffdfa06857a88df78514331',
            key: '8fb81863f8413bd617c2a55b69b8e10ff03d7c72',
            tags: ['selinux', 'security'],
            actor: 'check_se_linux',
            title: 'SElinux relabeling will be scheduled',
            summary:
              'SElinux relabeling will be scheduled as the status is permissive/enforcing.',
            audience: 'sysadmin',
            hostname: 'ectask',
            severity: 'info',
            timeStamp: '2022-11-01T17:50:33.761289Z',
          },
          {
            id: 'c649d0eb0602a7cf9952236b8a994e6793611eed22513b310e544e14be28fc32',
            key: '39d7183dafba798aa4bbb1e70b0ef2bbe5b1772f',
            tags: ['selinux', 'security'],
            actor: 'check_se_linux',
            title: 'SElinux will be set to permissive mode',
            detail: {
              remediations: [
                {
                  type: 'hint',
                  context:
                    'Make sure there are no SElinux related warnings after the upgrade and enable SElinux manually afterwards. Notice: You can ignore the "/root/tmp_leapp_py3" SElinux warnings.',
                },
              ],
            },
            summary:
              'SElinux will be set to permissive mode. Current mode: enforcing. This action is required by the upgrade process to make sure the upgraded system can boot without beinig blocked by SElinux rules.',
            audience: 'sysadmin',
            hostname: 'ectask',
            severity: 'low',
            timeStamp: '2022-11-01T17:50:33.785323Z',
          },
          {
            id: '00563d4e06e3f48d917a2237a97bd45890ed686f5dae6be95e0fef5c8e536282',
            key: '747a4ca25303eda17d1891bb85eeb226be14f252',
            tags: ['upgrade process'],
            actor: 'report_set_target_release',
            title:
              'The subscription-manager release is going to be set after the upgrade',
            detail: {
              remediations: [
                {
                  type: 'hint',
                  context:
                    'If you wish to receive updates for the latest released version of the target system, run `subscription-manager release --unset` after the upgrade.',
                },
              ],
              related_resources: [
                {
                  title: 'subscription-manager',
                  scheme: 'package',
                },
              ],
            },
            summary:
              'After the upgrade has completed the release of the subscription-manager will be set to 9.0. This will ensure that you will receive and keep the version you choose to upgrade to.',
            audience: 'sysadmin',
            hostname: 'ectask',
            severity: 'low',
            timeStamp: '2022-11-01T17:52:47.764706Z',
          },
        ],
        leapp_run_id: '39c4944e-265b-46dd-8290-a4278b91714b',
      },
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'dl-test-device-4',
  },
];

export const running_task = {
  id: 217,
  task_title: 'Running task',
  task_slug: 'running_task',
  description:
    'This is an example of a running task to test for running state.',
  task_url: 'https://console.redhat.com/api/tasks/v1/task/running_task',
  start_time: '2022-09-20T01:18:00',
  end_time: null,
  initiated_by: 'UserX',
  status: 'Running',
  system_count: 10,
};

export const running_task_jobs = [
  {
    executed_task: 234,
    system: 'f1356a99-754d-4219-9g25-fccb2cc6e2f2',
    status: 'Running',
    results: {},
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'dl-test-device-2',
  },
  {
    executed_task: 234,
    system: '3262b268-23ed-4c5a-a918-d8c4923fdfbf',
    status: 'Running',
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
