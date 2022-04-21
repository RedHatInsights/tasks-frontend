import getBaseName from '../getBaseName';

describe('getBaseName', () => {
  let baseName;
  it('returns correct base name', () => {
    baseName = getBaseName('/insights/tasks');
    expect(baseName).toEqual('/insights/tasks');
  });

  it('returns correct beta base name', () => {
    baseName = getBaseName('/beta/insights/tasks');
    expect(baseName).toEqual('/beta/insights/tasks');
  });
});
