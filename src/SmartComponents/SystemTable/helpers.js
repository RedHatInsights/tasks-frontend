import { ALL_SYSTEMS_VALUE } from './constants';

const buildSortString = (orderBy, orderDirection) => {
  let sortString = orderBy ? '&sort=' : '';
  let direction = '';
  if (orderDirection === 'DESC') {
    direction = '-';
  }
  let order =
    (orderBy === 'updated' && 'last_seen') ||
    (orderBy === 'os_version' && 'os') ||
    orderBy;

  return `${sortString}${direction}${order}`;
};

const buildOsFilterString = (osFilter) =>
  Object.entries(osFilter)
    .map(([majorOsVersion, minorOsVersions]) =>
      Object.entries(minorOsVersions)
        .map(([minorOsKey, value]) => {
          if (minorOsKey !== majorOsVersion && value === true) {
            const osArray = minorOsKey.split('-');
            const minorVersion = osArray.slice(
              osArray.length - 1,
              osArray.length
            );
            const osName = osArray.slice(0, osArray.length - 2).join(' ');

            return minorVersion && `${osName}|${minorVersion}`;
          }
        })
        .filter((v) => !!v)
        .join(',')
    )
    .filter((v) => !!v)
    .join(',');

const buildFilterString = (filters = {}) => {
  let osFiltersString = '';
  let groupsFilterString = '';
  let displayNameFilter = filters.hostnameOrId
    ? `&display_name=${filters.hostnameOrId}`
    : '';

  if (filters.osFilter) {
    const builtOsFilterString = buildOsFilterString(filters.osFilter);
    osFiltersString += builtOsFilterString
      ? '&operating_system=' + builtOsFilterString
      : '';
  }

  filters.hostGroupFilter?.forEach((group) => {
    groupsFilterString += `&groups=${group}`;
  });

  return `${displayNameFilter}${osFiltersString}${groupsFilterString}`;
};

const buildTagsFilterString = (tags, filters) => {
  let tagsFilterString = tags?.length ? '&tags=' : '';
  let globalTagsFilterString = '';
  let tagFiltersString = '';
  tags?.forEach((tag, index) => {
    index ? (globalTagsFilterString += ',') : (globalTagsFilterString += '');
    globalTagsFilterString += `${tag}`;
  });
  filters.tagFilters?.forEach((tag, index) => {
    index === 0 && globalTagsFilterString === ''
      ? (tagFiltersString += '')
      : (tagFiltersString += ',');
    tag.values.forEach(
      (value) => (tagFiltersString += `${tag.category}/${value.name}`)
    );
  });

  return `${tagsFilterString}${globalTagsFilterString}${tagFiltersString}`;
};

const buildWorkloadFiltersString = (filters) => {
  let workloadFilterString = '';
  for (const [key, value] of Object.entries(filters)) {
    workloadFilterString += `&${key}=${value}`;
  }

  return encodeURI(workloadFilterString);
};

const buildEligibilityFilterString = ({ filters }) => {
  return filters[0]?.chips[0]?.value === ALL_SYSTEMS_VALUE
    ? '&all_systems=true'
    : '';
};

// TODO this should be based on a URLSearchParams object and use its toString() function
export const buildFilterSortString = (
  limit,
  offset,
  orderBy,
  orderDirection,
  filters,
  tags,
  workloadFilters,
  activeFiltersConfig
) => {
  let limitOffsetString = `limit=${limit}&offset=${offset}`;
  let sortString = buildSortString(orderBy, orderDirection);
  let filterString = buildFilterString(filters);
  let tagsFilterString = buildTagsFilterString(tags, filters);
  let workloadFilterString = buildWorkloadFiltersString(workloadFilters);
  let eligibilityFilterString =
    buildEligibilityFilterString(activeFiltersConfig);
  return `?${limitOffsetString}${sortString}${filterString}${tagsFilterString}${workloadFilterString}${eligibilityFilterString}`;
};

export const findCheckedValue = (total, selected) => {
  if (selected === total && total > 0) {
    return true;
  } else if (selected > 0 && selected < total) {
    return null;
  } else {
    return false;
  }
};

export const findFilterData = (optionName, options) => {
  return options.find((item) => item.label === optionName);
};
