import { systemColumns } from '../constants';

describe('systemColumns', () => {
  it('should not contain system_profile column when slug is not "rhel-ai-update"', () => {
    const result = systemColumns('some-other-slug');
    expect(result).not.toContainEqual({
      key: 'system_profile',
      props: { width: 10, isStatic: true },
      title: 'RHEL AI Version',
      renderFunc: expect.any(Function),
    });
  });

  it('should return additional "RHEL AI Version" column when slug is "rhel-ai-update"', () => {
    const result = systemColumns('rhel-ai-update');
    expect(result).toContainEqual({
      key: 'system_profile',
      props: { width: 10, isStatic: true },
      title: 'RHEL AI Version',
      renderFunc: expect.any(Function),
    });
  });
});
