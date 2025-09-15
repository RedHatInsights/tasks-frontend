export const fixturesPlainReport = {
  display_name: 'host_abc',
  status: 'Success',
  results: {
    report:
      'Lorem ipsum dolor sit amet, "consectetuer" adipiscing elit. Maecenas fermentum, sem in pharetra pellentesque, velit turpis > !volutpat ante, in pharetra metus odio a lectus. ',
    message: 'Lorem ipsum dolor sit amet',
  },
};

export const fixturesExtendedReport = {
  system: 'd06577c7-0d21-4796-82c4-b03453d16918',
  display_name: null,
  status: 'Success',
  results: {
    report:
      'Lorem ipsum dolor sit amet, "consectetuer" adipiscing elit.\nMaecenas fermentum, sem in pharetra pellentesque, velit turpis > !volutpat ante, in pharetra metus odio a lectus.',
    message:
      'The upgrade cannot proceed. Your system has 1 inhibitor out of 8 potential problems.',
    report_json: {
      entries: [
        {
          id: '516addaddb1d220e5ca442ff3e29293d7af992621eb831815bc28943fa5b1c',
          key: '1b91322362ae7830e48eee7811be9527747de8',
          title: 'Excluded target system repositories',
          detail: {
            remediations: [
              {
                type: 'hint',
                context:
                  'Lorem ipsum dolor sit amet, "consectetuer" adipiscing elit.',
              },
            ],
          },
          summary:
            'The following repositories are not supported by Red Hat and are excluded from the list of repositories used during the upgrade.\n- codeready-builder-for-rhel-9-x86_64-eus-rpms\n- codeready-builder-for-rhel-9-aarch64-rpms\n- rhui-codeready-builder-for-rhel-9-aarch64-rhui-rpms\n- codeready-builder-for-rhel-9-s390x-eus-rpms\n- rhui-codeready-builder-for-rhel-9-x86_64-rhui-rpms\n- codeready-builder-for-rhel-9-aarch64-eus-rpms\n- codeready-builder-for-rhel-9-s390x-rpms\n- codeready-builder-beta-for-rhel-9-aarch64-rpms\n- codeready-builder-for-rhel-9-x86_64-rhui-rpms\n- codeready-builder-beta-for-rhel-9-s390x-rpms\n- codeready-builder-beta-for-rhel-9-x86_64-rpms\n- codeready-builder-for-rhel-9-ppc64le-eus-rpms\n- codeready-builder-for-rhel-9-ppc64le-rpms\n- codeready-builder-beta-for-rhel-9-ppc64le-rpms\n- codeready-builder-for-rhel-9-x86_64-rpms\n- codeready-builder-for-rhel-9-rhui-rpms',
          hostname: 'iqe-vm-tasks-d52a0049-d6a3-49ca-a565-9896b79d0df4',
          severity: 'info',
        },
        {
          id: '4d6de2d4daff8c48b25bb7791ba2f94d30b8e37c2cf74f934f90435510306c',
          key: '1c7a949a747ec9890f04bf4321de7280970715',
          title:
            'The installed OS version is not supported for the in-place upgrade to the target RHEL version',
          detail: {},
          summary:
            'The supported OS releases for the upgrade process:\n RHEL 8.8\nRHEL 8.10\nRHEL-SAPHANA 8.8\nRHEL-SAPHANA 8.10',
          hostname: 'iqe-vm-tasks-d52a0049-d6a3-49ca-a565-9896b79d0df4',
          severity: 'inhibitor',
        },
        {
          id: 'ce9c370a30ad1619aaf4664314f44e6bff1bf7c0da7b2542928018f4387697',
          key: 'ac7030e05de248d34f08a9fa040b352bc410a3',
          title: 'GRUB2 core will be automatically updated during the upgrade',
          summary:
            'On legacy (BIOS) systems, GRUB2 core (located in the gap between the MBR and the first partition) cannot be updated during the rpm transaction and Leapp has to initiate the update running "grub2-install" after the transaction. No action is needed before the upgrade. After the upgrade, it is recommended to check the GRUB configuration.',
          hostname: 'iqe-vm-tasks-d52a0049-d6a3-49ca-a565-9896b79d0df4',
          severity: 'high',
        },
        {
          id: '81e94942da7980c45bc2e0f1cc95abbb961d63c63f62c7607021a390628ecb',
          key: '8fb818f8413bd617c2a55b69b8e10ff03d7c72',
          title: 'SElinux relabeling will be scheduled',
          summary:
            'SElinux relabeling will be scheduled as the status is permissive/enforcing.',
          hostname: 'iqe-vm-tasks-d52a0049-d6a3-49ca-a565-9896b79d0df4',
          severity: 'info',
        },
        {
          id: '571dff1262ade361274ca8bee42f11744f200d88d61926b3fd8a4b69f6ab3',
          key: '39d7183dafba79a4bbb1e70b0ef2bbe5b1772f',
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
          hostname: 'iqe-vm-tasks-d52a0049-d6a3-49ca-a565-9896b79d0df4',
          severity: 'low',
        },
        {
          id: '60fee68aa010bcc41ebe17c57a68ec9eb7661f854b45568f45c5fd85f46370',
          key: 'e738f78bc8f3a84414210e3b609057139d1855',
          title: 'Remote root logins globally allowed using password',
          detail: {
            remediations: [
              {
                type: 'hint',
                context:
                  'If you depend on remote root logins using passwords, consider setting up a different user for remote administration. Otherwise you can ignore this message.',
              },
            ],
          },
          summary:
            'RHEL9 no longer allows remote root logins, but the server configuration explicitly overrides this default. The configuration file will not be updated and root is still going to be allowed to login with password. This is not recommended and considered as a security risk.',
          hostname: 'iqe-vm-tasks-d52a0049-d6a3-49ca-a565-9896b79d0df4',
          severity: 'high',
        },
        {
          id: '187efd769d50466674a1b72a35fa8c0d88afdb563c7833beef94bb38fbdbc',
          key: '96da6937c25c6492e4f1228e46795989fd3718',
          title:
            'The upgrade will prepend the Include directive to OpenSSH sshd_config',
          detail: {},
          summary:
            'OpenSSH server configuration needs to be modified to contain Include directive for the RHEL9 to work properly and integrate with the other parts of the OS. The following snippet will be added to the /etc/ssh/sshd_config during the ApplicationsPhase: `Include /etc/ssh/sshd_config.d/*.conf`',
          hostname: 'iqe-vm-tasks-d52a0049-d6a3-49ca-a565-9896b79d0df4',
          severity: 'info',
        },
        {
          id: 'c42b5edcf36969727cee80a66dc5239fe4d69d4d324e7e6e698cb58b9d1a0',
          key: '693963253195f41852045b6d630a1f4c7a193d',
          title: 'Automatic registration into Red Hat Lightspeed',
          summary:
            "After the upgrade, this system will be automatically registered into Red Hat Lightspeed. To skip the automatic registration, use the '--no-insights-register' command line option or set the LEAPP_NO_INSIGHTS_REGISTER environment variable.",
          hostname: 'iqe-vm-tasks-d52a49-d6a3-49ca-a565-9896b79d0df4',
          severity: 'info',
        },
      ],
    },
  },
};
