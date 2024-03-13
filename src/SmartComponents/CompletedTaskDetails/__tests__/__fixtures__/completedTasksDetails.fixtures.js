import { CONVERSION_SLUG } from '../../../../constants';

export const log4j_task = {
  id: 42,
  name: 'log4j task',
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
  name: 'leapp task',
  task_slug: 'leapp-preupgrade',
  task_title: 'Upgrade RHEL version with LEAP tool',
  task_description:
    'Uses the insights-client to determine if RHEL version can be upgraded with LEAP tool. Resource intensive scan',
  start_time: '2022-04-21T10:10:00',
  end_time: '2022-04-23T11:10:00',
  initiated_by: 'Michael',
  status: 'Running',
  system_count: 5,
  systems_count: 5,
};

export const convert2rhel_task_details = {
  id: 2909,
  name: `${CONVERSION_SLUG}-preanalysis task`,
  alerts_count: 3,
  task_slug: `${CONVERSION_SLUG}-preanalysis`,
  task_title: 'Convert to RHEL Preanalysis',
  task_description:
    'For connected systems running distributions compatible with RHEL 7 or RHEL 8 (for example, CentOS 7), the RHEL preconversion analysis will predict potential conflicts before you convert. Run this task to understand the impact of a conversion on your fleet and make a remediation plan before your maintenance window begins.',
  start_time: '2023-06-01T19:58:51.330433Z',
  end_time: '2023-07-16T20:30:24.772008Z',
  initiated_by: 'insights-qa',
  status: 'Running',
  system_count: 2,
  systems_count: 2,
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
      report:
        'Risk Factor: high (inhibitor)\nTitle: Firewalld Configuration AllowZoneDrifting Is Unsupported\nSummary: Firewalld has enabled configuration option "AllowZoneDrifiting" which has been removed in RHEL-9. New behavior is as if "AllowZoneDrifiting" was set to "no".\nRemediation: [hint] Set AllowZoneDrifting=no in /etc/firewalld/firewalld.conf\n[command] sed -i "s/^AllowZoneDrifting=.*/AllowZoneDrifting=no/" /etc/firewalld/firewalld.conf\nKey: 5b1cf050e1a877b0358b6e8c612277c591d40c13\n----------------------------------------\nRisk Factor: high (inhibitor)\nTitle: VDO devices migration to LVM management\nSummary: VDO devices \'vda, vda1, vda2\' require migration to LVM management.After performing the upgrade VDO devices can only be managed via LVM. Any VDO device not currently managed by LVM must be converted to LVM management before upgrading. The data on any VDO device not converted to LVM management will be inaccessible after upgrading.\nRemediation: [hint] Consult the VDO to LVM conversion process documentation for how to perform the conversion.\nKey: f7c335398cc449f5d7baf4e73255d44c34ad2620\n----------------------------------------\nRisk Factor: high\nTitle: Leapp could not identify where GRUB core is located\nSummary: We assume GRUB core is located on the same device as /boot. Leapp needs to update GRUB core as it is not done automatically on legacy (BIOS) systems. \nRemediation: [hint] Please run "grub2-install <GRUB_DEVICE> command manually after upgrade\nKey: ca7a1a66906a7df3da890aa538562708d3ea6ecd\n----------------------------------------\nRisk Factor: low\nTitle: SElinux will be set to permissive mode\nSummary: SElinux will be set to permissive mode. Current mode: enforcing. This action is required by the upgrade process to make sure the upgraded system can boot without beinig blocked by SElinux rules.\nRemediation: [hint] Make sure there are no SElinux related warnings after the upgrade and enable SElinux manually afterwards. Notice: You can ignore the "/root/tmp_leapp_py3" SElinux warnings.\nKey: 39d7183dafba798aa4bbb1e70b0ef2bbe5b1772f\n----------------------------------------\nRisk Factor: info\nTitle: SElinux relabeling will be scheduled\nSummary: SElinux relabeling will be scheduled as the status is permissive/enforcing.\nKey: 8fb81863f8413bd617c2a55b69b8e10ff03d7c72\n----------------------------------------',
      message: 'Your system has 3 inhibitors out of 5 potential problems.',
      report_json: {
        entries: [
          {
            id: 'dd4d85e3bd8dc735c8879db345739fb8559346860dfa3a7a7beb97ff9e87c657',
            key: '8fb81863f8413bd617c2a55b69b8e10ff03d7c72',
            groups: ['selinux', 'security'],
            actor: 'check_se_linux',
            title: 'SElinux relabeling will be scheduled',
            summary:
              'SElinux relabeling will be scheduled as the status is permissive/enforcing.',
            audience: 'sysadmin',
            hostname: 'dan-laptop',
            severity: 'info',
            timeStamp: '2022-10-12T17:16:44.065672Z',
          },
          {
            id: 'a5ba90e20f218c2a60ea0422111175e27cd539f12c2a218187370bc47dbb3c7a',
            key: '39d7183dafba798aa4bbb1e70b0ef2bbe5b1772f',
            groups: ['selinux', 'security'],
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
            hostname: 'dan-laptop',
            severity: 'low',
            timeStamp: '2022-10-12T17:16:44.068127Z',
          },
          {
            id: '82fd5d4d1775d32c4557e79f9e12742f590006c8235b161ef58436d4b987ac0d',
            key: 'ca7a1a66906a7df3da890aa538562708d3ea6ecd',
            groups: ['boot'],
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
            hostname: 'dan-laptop',
            severity: 'high',
            timeStamp: '2022-10-12T17:16:44.255785Z',
          },
          {
            id: '92fd84a5ad754d5fc79948b3340a6fc81ef8530e669fa233b987490ccdf0c29b',
            key: '5b1cf050e1a877b0358b6e8c612277c591d40c13',
            actor: 'firewalld_check_allow_zone_drifting',
            groups: ['inhibitor', 'sanity', 'firewall'],
            title: 'Firewalld Configuration AllowZoneDrifting Is Unsupported',
            detail: {
              external: [
                {
                  url: 'https://access.redhat.com/articles/4855631',
                  title: 'Changes in firewalld related to Zone Drifting',
                },
              ],
              remediations: [
                {
                  type: 'hint',
                  context:
                    'Set AllowZoneDrifting=no in /etc/firewalld/firewalld.conf',
                },
                {
                  type: 'command',
                  context: [
                    'sed',
                    '-i',
                    '"s/^AllowZoneDrifting=.*/AllowZoneDrifting=no/"',
                    '/etc/firewalld/firewalld.conf',
                  ],
                },
              ],
            },
            summary:
              'Firewalld has enabled configuration option "AllowZoneDrifiting" which has been removed in RHEL-9. New behavior is as if "AllowZoneDrifiting" was set to "no".',
            audience: 'sysadmin',
            hostname: 'dan-laptop',
            severity: 'high',
            timeStamp: '2022-10-12T17:16:44.761496Z',
          },
          {
            id: 'a154ad76bfe09f583373668b8a795fc7a0e107eceb8c59742a63df8ed72534be',
            key: 'f7c335398cc449f5d7baf4e73255d44c34ad2620',
            groups: ['inhibitor', 'services', 'drivers'],
            actor: 'check_vdo',
            title: 'VDO devices migration to LVM management',
            detail: {
              remediations: [
                {
                  type: 'hint',
                  context:
                    'Consult the VDO to LVM conversion process documentation for how to perform the conversion.',
                },
              ],
            },
            summary:
              "VDO devices 'vda, vda1, vda2' require migration to LVM management.After performing the upgrade VDO devices can only be managed via LVM. Any VDO device not currently managed by LVM must be converted to LVM management before upgrading. The data on any VDO device not converted to LVM management will be inaccessible after upgrading.",
            audience: 'sysadmin',
            hostname: 'dan-laptop',
            severity: 'high',
            timeStamp: '2022-10-12T17:16:47.104093Z',
          },
        ],
        leapp_run_id: 'e7d38746-cfe4-4ec3-8ad5-4e6a16790cf4',
      },
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
      message: 'Your system has 1 inhibitor out of 4 potential problems',
      report:
        'Risk Factor: high\nTitle: Leapp could not identify where GRUB core is located\nSummary: We assume GRUB core is located on the same device as /boot. Leapp needs to update GRUB core as it is not done automatically on legacy (BIOS) systems. \nRemediation: [hint] Please run "grub2-install <GRUB_DEVICE> command manually after upgrade\nKey: ca7a1a66906a7df3da890aa538562708d3ea6ecd\n----------------------------------------\nRisk Factor: low\nTitle: SElinux will be set to permissive mode\nSummary: SElinux will be set to permissive mode. Current mode: enforcing. This action is required by the upgrade process to make sure the upgraded system can boot without beinig blocked by SElinux rules.\nRemediation: [hint] Make sure there are no SElinux related warnings after the upgrade and enable SElinux manually afterwards. Notice: You can ignore the "/root/tmp_leapp_py3" SElinux warnings.\nKey: 39d7183dafba798aa4bbb1e70b0ef2bbe5b1772f\n----------------------------------------\nRisk Factor: low\nTitle: The subscription-manager release is going to be set after the upgrade\nSummary: After the upgrade has completed the release of the subscription-manager will be set to 9.0. This will ensure that you will receive and keep the version you choose to upgrade to.\nRemediation: [hint] If you wish to receive updates for the latest released version of the target system, run `subscription-manager release --unset` after the upgrade.\nKey: 747a4ca25303eda17d1891bb85eeb226be14f252\n----------------------------------------\nRisk Factor: info\nTitle: SElinux relabeling will be scheduled\nSummary: SElinux relabeling will be scheduled as the status is permissive/enforcing.\nKey: 8fb81863f8413bd617c2a55b69b8e10ff03d7c72\n----------------------------------------\n',
      report_json: {
        entries: [
          {
            id: 'c5a74566244db3b2a9e6570302b4cb61af9c3ad0a60d2433975881f823cb06dd',
            key: 'ca7a1a66906a7df3da890aa538562708d3ea6ecd',
            groups: ['boot'],
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
            groups: ['selinux', 'security'],
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
            groups: ['selinux', 'security'],
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
            groups: ['upgrade process'],
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
  {
    executed_task: 235,
    system: 'f1356a99-754d-4219-9g25-fccb2cf29c91',
    status: 'Success',
    results: {
      alert: true,
      message: 'Your system has 1 inhibitor out of 4 potential problems',
      report:
        'Risk Factor: high\nTitle: Leapp could not identify where GRUB core is located\nSummary: We assume GRUB core is located on the same device as /boot. Leapp needs to update GRUB core as it is not done automatically on legacy (BIOS) systems. \nRemediation: [hint] Please run "grub2-install <GRUB_DEVICE> command manually after upgrade\nKey: ca7a1a66906a7df3da890aa538562708d3ea6ecd\n----------------------------------------\nRisk Factor: low\nTitle: SElinux will be set to permissive mode\nSummary: SElinux will be set to permissive mode. Current mode: enforcing. This action is required by the upgrade process to make sure the upgraded system can boot without beinig blocked by SElinux rules.\nRemediation: [hint] Make sure there are no SElinux related warnings after the upgrade and enable SElinux manually afterwards. Notice: You can ignore the "/root/tmp_leapp_py3" SElinux warnings.\nKey: 39d7183dafba798aa4bbb1e70b0ef2bbe5b1772f\n----------------------------------------\nRisk Factor: low\nTitle: The subscription-manager release is going to be set after the upgrade\nSummary: After the upgrade has completed the release of the subscription-manager will be set to 9.0. This will ensure that you will receive and keep the version you choose to upgrade to.\nRemediation: [hint] If you wish to receive updates for the latest released version of the target system, run `subscription-manager release --unset` after the upgrade.\nKey: 747a4ca25303eda17d1891bb85eeb226be14f252\n----------------------------------------\nRisk Factor: info\nTitle: SElinux relabeling will be scheduled\nSummary: SElinux relabeling will be scheduled as the status is permissive/enforcing.\nKey: 8fb81863f8413bd617c2a55b69b8e10ff03d7c72\n----------------------------------------\n',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'dl-test-device-5',
  },
];

export const convert2rhel_task_jobs = [
  {
    id: 3101,
    executed_task: 2909,
    system: 'f1356a99-754d-4219-9g25-fccb2cc6e2f2',
    status: 'Success',
    results: {
      message:
        'No inhibtors found, conversion should run smoothly for this system.',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'centos7-test-device-1',
    has_stdout: false,
  },
  {
    id: 3102,
    executed_task: 2909,
    system: 'f1356a99-754d-4219-9g25-fccb2cc53bee',
    status: 'Success',
    results: {
      alert: false,
      report: '',
      message: 'Your system has 3 inhibitors out of 3 potential problems.',
      report_json: {
        entries: [
          {
            id: 'INVALID_KERNEL_VERSION',
            key: 'IS_LOADED_KERNEL_LATEST::INVALID_KERNEL_VERSION',
            tags: [],
            actor: 'IS_LOADED_KERNEL_LATEST',
            title:
              'The version of the loaded kernel is different from the latest version',
            detail: {
              diagnosis: [
                {
                  context:
                    'Latest kernel version available in updates: 3.10.0-1160.90.1.el7\n Loaded kernel version: 3.10.0-1160.88.1.el7',
                },
              ],
              remediations: [
                {
                  type: 'hint',
                  context:
                    'To proceed with the conversion, update the kernel version by executing the following steps:\n\n1. yum install kernel-3.10.0-1160.90.1.el7 -y\n2. reboot',
                },
              ],
            },
            summary:
              'The version of the loaded kernel is different from the latest version in the enabled system repositories.',
            audience: 'sysadmin',
            hostname: 'dan-laptop',
            severity: 'Error',
            timeStamp: '2022-10-12T17:16:44.255785Z',
          },
          {
            id: 'SECURE_BOOT_DETECTED',
            key: 'EFI::SECURE_BOOT_DETECTED',
            tags: [],
            actor: 'EFI',
            flags: ['inhibitor'],
            title: 'Secure boot detected',
            detail: {
              diagnosis: [
                {
                  context:
                    'In order to continue the conversion, secure boot must be disabled',
                },
              ],
              remediations: [
                {
                  type: 'hint',
                  context:
                    'To disable the secure boot, follow the instructions available in this article: https://access.redhat.com/solutions/6753681',
                },
              ],
            },
            summary:
              'The conversion with secure boot is currently not possible.',
            audience: 'sysadmin',
            hostname: 'dan-laptop',
            severity: 'Error',
            timeStamp: '2022-10-12T17:16:47.104093Z',
          },
          {
            id: 'PACKAGE_UP_TO_DATE_CHECK_FAIL',
            key: 'PACKAGE_UPDATES::PACKAGE_UP_TO_DATE_CHECK_FAIL',
            tags: [],
            actor: 'PACKAGE_UPDATES',
            flags: ['inhibitor'],
            title: 'Package up to date check fail',
            detail: {
              diagnosis: [
                {
                  context:
                    'There was an error while checking whether the installed packages are up-to-date. Having an updated system is an important prerequisite for a successful conversion.',
                },
              ],
              remediations: [
                {
                  type: 'hint',
                  context:
                    'Consider verifyng the system is up to date manually before proceeding with the conversion.',
                },
              ],
            },
            summary:
              'The conversion with secure boot is currently not possible.',
            audience: 'sysadmin',
            hostname: 'dan-laptop',
            severity: 'Overridable',
            timeStamp: '2022-10-12T17:16:47.104093Z',
          },
        ],
        leapp_run_id: 'e7d38746-cfe4-4ec3-8ad5-4e6a16790cf4',
      },
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'centos7-test-device-2',
    has_stdout: true,
  },
  {
    id: 3103,
    executed_task: 2909,
    system: 'f1356a99-754d-4219-9g25-fccb2cc6e2f2',
    status: 'Success',
    results: {
      message:
        'No inhibtors found, conversion should run smoothly for this system.',
      report_json: {
        entries: [
          {
            id: 'REPOSITORY_FILE_PACKAGES_REMOVED',
            key: 'REMOVE_REPOSITORY_FILES_PACKAGES::REPOSITORY_FILE_PACKAGES_REMOVED',
            tags: [],
            actor: 'REMOVE_REPOSITORY_FILES_PACKAGES',
            flags: [],
            title: 'Repository file package removal',
            summary:
              'The following packages were removed: NetworkManager-1.18.8-2.0.1.el7_9, kernel-core-0:4.18.0-240.10.1.el8_3',
            audience: 'sysadmin',
            hostname: 'dan-laptop',
            severity: 'Info',
            timeStamp: '2022-10-12T17:16:47.104093Z',
          },
          {
            id: 'SECURE_BOOT_DETECTED',
            key: 'DBUS_IS_RUNNING::SECURE_BOOT_DETECTED',
            tags: [],
            actor: 'DBUS_IS_RUNNING',
            title: 'Dbus is running check skip',
            summary:
              'Skipping the check because we have been asked not to subscribe this system to RHSM',
            audience: 'sysadmin',
            hostname: 'dan-laptop',
            severity: 'Warning',
            timeStamp: '2022-10-12T17:16:44.065672Z',
          },
          {
            key: 'LIST_THIRD_PARTY_PACKAGES::THIRD_PARTY_PACKAGE_DETECTED',
            title: 'Third party packages detected',
            summary:
              'Third party packages will not be replaced during the conversion.',
            severity: 'OVERRIDABLE',
            detail: {
              diagnosis: [
                {
                  context:
                    "Only packages signed by CentOS Linux are to be replaced. Red Hat support won't be provided for the following third party packages:convert2rhel-1.5.0-2.20231124114206033039.main.14.g938833b.el7.noarch",
                },
              ],
              remediations: [
                {
                  context:
                    "If you wish to ignore this message, set the environment variable 'CONVERT2RHEL_THIRD_PARTY_PACKAGE_CHECK_SKIP' to 1.",
                },
              ],
            },
          },
        ],
      },
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: 'centos7-test-device-3',
    has_stdout: true,
  },
  {
    id: 3104,
    executed_task: 2909,
    system: 'f1356a99-754d-4219-9g25-fccb2cc6e2f2',
    status: 'Success',
    results: {
      message:
        'No inhibtors found, conversion should run smoothly for this system.',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: null,
    has_stdout: false,
  },
];

export const running_task = {
  id: 217,
  name: 'running task',
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

export const jobs_with_deleted_system = [
  {
    executed_task: 234,
    system: 'f1356a99-754d-4219-9g25-fccb2cc6e2f2',
    status: 'Success',
    results: {
      message: 'This was a success.',
    },
    updated_on: '2022-08-08T18:19:50.898540Z',
    display_name: null,
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
