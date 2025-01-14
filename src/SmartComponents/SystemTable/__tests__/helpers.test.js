import { buildFilterSortString } from '../helpers';

describe('buildFilterSortString', () => {
  const limit = 25;
  const offset = 0;
  const orderBy = 'name';
  const orderDirection = 'desc';
  const tags = [];
  const workloadFilters = [];
  const activeFiltersConfig = { filters: {} };

  it('should return a default filterstring when no filters given', () => {
    expect(
      buildFilterSortString(
        limit,
        offset,
        orderBy,
        orderDirection,
        {},
        tags,
        workloadFilters,
        activeFiltersConfig
      )
    ).toEqual('?limit=25&offset=0&sort=name&all_systems=true');
  });

  it('should not return all_systems=true when eligible systems filter applied', () => {
    let activefilters = {
      filters: [
        {
          id: 'Task eligibility',
          category: 'Task eligibility',
          chips: [{ name: 'Eligible Systems', value: 'eligible-systems' }],
        },
      ],
    };
    expect(
      buildFilterSortString(
        limit,
        offset,
        orderBy,
        orderDirection,
        {},
        tags,
        workloadFilters,
        activefilters
      )
    ).toEqual('?limit=25&offset=0&sort=name');
  });

  it('should return an operating system filter string when given osFilter', () => {
    let filters = {
      osFilter: {
        'RHEL-9': {
          'RHEL-9': null,
          'RHEL-9-9.4': true,
        },
      },
    };
    expect(
      buildFilterSortString(
        limit,
        offset,
        orderBy,
        orderDirection,
        filters,
        tags,
        workloadFilters,
        activeFiltersConfig
      )
    ).toEqual(
      '?limit=25&offset=0&sort=name&operating_system=RHEL|9.4&all_systems=true'
    );

    filters = {
      osFilter: {
        'RHEL-9': {
          'RHEL-9': null,
          'RHEL-9-9.4': false,
          'RHEL-9-9.3': true,
        },
      },
    };
    expect(
      buildFilterSortString(
        limit,
        offset,
        orderBy,
        orderDirection,
        filters,
        tags,
        workloadFilters,
        activeFiltersConfig
      )
    ).toEqual(
      '?limit=25&offset=0&sort=name&operating_system=RHEL|9.3&all_systems=true'
    );

    filters = {
      osFilter: {
        'RHEL-9': {
          'RHEL-9': null,
          'RHEL-9-9.4': true,
          'RHEL-9-9.3': true,
          'RHEL-9-9.9': true,
        },
        'RHEL-8': {
          'RHEL-8': null,
          'RHEL-8-8.4': true,
        },
        'AlmaLinux-8': {
          'AlmaLinux-8': null,
          'AlmaLinux-8-8.4': true,
          'AlmaLinux-8-8.5': true,
        },
      },
    };
    expect(
      buildFilterSortString(
        limit,
        offset,
        orderBy,
        orderDirection,
        filters,
        tags,
        workloadFilters,
        activeFiltersConfig
      )
    ).toEqual(
      '?limit=25&offset=0&sort=name&operating_system=RHEL|9.4,RHEL|9.3,RHEL|9.9,RHEL|8.4,AlmaLinux|8.4,AlmaLinux|8.5&all_systems=true'
    );

    filters = {
      osFilter: {
        'RHEL-9': {
          'RHEL-9': true,
          'RHEL-9-9.5': true,
          'RHEL-9-9.4': true,
          'RHEL-9-9.3': true,
          'RHEL-9-9.2': true,
          'RHEL-9-9.1': true,
          'RHEL-9-9.0': true,
        },
        'Cent-Os-Linux-8': {
          'Cent-Os-Linux-8': null,
          'Cent-Os-Linux-8-8.4': true,
          'Cent-Os-Linux-8-8.5': true,
        },
      },
    };
    expect(
      buildFilterSortString(
        limit,
        offset,
        orderBy,
        orderDirection,
        filters,
        tags,
        workloadFilters,
        activeFiltersConfig
      )
    ).toEqual(
      '?limit=25&offset=0&sort=name&operating_system=RHEL|9.5,RHEL|9.4,RHEL|9.3,RHEL|9.2,RHEL|9.1,RHEL|9.0,Cent Os Linux|8.4,Cent Os Linux|8.5&all_systems=true'
    );

    filters = {
      osFilter: {
        'RHEL-9': {
          'RHEL-9': null,
          'RHEL-9-9.4': true,
          'RHEL-9-9.3': true,
          'RHEL-9-9.9': true,
        },
        'RHEL-8': {
          'RHEL-8': null,
          'RHEL-8-8.4': true,
        },
        'Alma-Linux-8': {
          'Alma-Linux-8': null,
          'Alma-Linux-8-8.4': true,
          'Alma-Linux-8-8.5': true,
        },
        'Cent-Os-8': {
          'Cent-Os-8': null,
          'Cent-Os-8-8.4': true,
          'Cent-Os-8-8.5': true,
        },
        'Cent-Os-30': {
          'Cent-Os-30': null,
          'Cent-Os-30-30.99': true,
          'Cent-Os-30-30.88': true,
        },
      },
    };
    expect(
      buildFilterSortString(
        limit,
        offset,
        orderBy,
        orderDirection,
        filters,
        tags,
        workloadFilters,
        activeFiltersConfig
      )
    ).toEqual(
      '?limit=25&offset=0&sort=name&operating_system=RHEL|9.4,RHEL|9.3,RHEL|9.9,RHEL|8.4,Alma Linux|8.4,Alma Linux|8.5,Cent Os|8.4,Cent Os|8.5,Cent Os|30.99,Cent Os|30.88&all_systems=true'
    );

    filters = {
      osFilter: {
        'RHEL-9': {
          'RHEL-9': null,
          'RHEL-9-9.4': true,
          'RHEL-9-9.3': true,
          'RHEL-9-9.9': true,
        },
        'RHEL-8': {
          'RHEL-8': null,
        },
        'AlmaLinux-8': {
          'AlmaLinux-8': null,
          'AlmaLinux-8-8.4': true,
          'AlmaLinux-8-8.5': true,
        },
      },
    };
    expect(
      buildFilterSortString(
        limit,
        offset,
        orderBy,
        orderDirection,
        filters,
        tags,
        workloadFilters,
        activeFiltersConfig
      )
    ).toEqual(
      '?limit=25&offset=0&sort=name&operating_system=RHEL|9.4,RHEL|9.3,RHEL|9.9,AlmaLinux|8.4,AlmaLinux|8.5&all_systems=true'
    );
  });
});
