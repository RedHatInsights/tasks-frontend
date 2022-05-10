import { camelCase, getProperty, orderArrayByProp, uniq } from '../helpers';
import items from '../hooks/useTableTools/__tests__/__fixtures__/items.fixtures';

describe('uniq', () => {
  it('should deduplicate items', () => {
    let result = uniq(['a', 'b', 'b', 'c']);
    expect(result.sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('orderArrayByProp', () => {
  it('sorts an array by numbers asc', () => {
    expect(orderArrayByProp('system_count', items, 'asc')).toMatchSnapshot();
  });

  it('sorts an array by numbers desc', () => {
    expect(orderArrayByProp('system_count', items, 'desc')).toMatchSnapshot();
  });

  it('sorts an array by string asc', () => {
    expect(orderArrayByProp('title', items, 'asc')).toMatchSnapshot();
  });

  it('sorts an array by string desc', () => {
    expect(orderArrayByProp('title', items, 'desc')).toMatchSnapshot();
  });
});

/* stand-in test. may not need this function in tasks */
describe('getPropery', () => {
  const object = {
    level1: {
      level2: {
        level3: {
          value: 'value-level-3',
        },
        value: 'value-level-2',
      },
    },
  };

  it('should return values of keys', () => {
    expect(getProperty(object, 'level1.level2.level3.value')).toMatchSnapshot();
    expect(getProperty(object, 'level1.level2.value')).toMatchSnapshot();
    expect(getProperty({}, '', jest.fn())).toMatchSnapshot();
  });
});

describe('camelCase', () => {
  it('should set to camelcase', () => {
    expect(camelCase('system_count')).toBe('SystemCount');
  });
});
