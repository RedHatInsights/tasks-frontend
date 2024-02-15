import { ALL_SYSTEMS } from './constants';

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

const buildFilterString = (filters) => {
  let osFiltersString = '';
  let displayNameFilter = filters.hostnameOrId
    ? `&display_name=${filters.hostnameOrId}`
    : '';

  filters.osFilter?.forEach(({ osName, value }) => {
    osFiltersString += `&operating_system=${osName}|${value}`;
  });

  return `${displayNameFilter}${osFiltersString}`;
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
  return filters[0]?.chips[0]?.value === ALL_SYSTEMS ? '&all_systems=true' : '';
};

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
