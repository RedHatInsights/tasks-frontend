const buildSortString = (orderBy, orderDirection) => {
  let sortString = orderBy ? '&sort=' : '';
  let direction = '';
  if (orderDirection === 'DESC') {
    direction = '-';
  }
  let order = orderBy === 'updated' ? 'last_seen' : orderBy;

  return `${sortString}${direction}${order}`;
};

const buildFilterString = (filters) => {
  let displayNameFilter = filters.hostnameOrId
    ? `&display_name=${filters.hostnameOrId}`
    : '';

  let osFilter = filters.osFilter?.length
    ? '&os_version=' + filters.osFilter.join(',')
    : '';

  return `${displayNameFilter}${osFilter}`;
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

export const buildFilterSortString = (
  limit,
  offset,
  orderBy,
  orderDirection,
  filters,
  tags,
  workloadFilters
) => {
  let limitOffsetString = `limit=${limit}&offset=${offset}`;
  let sortString = buildSortString(orderBy, orderDirection);
  let filterString = buildFilterString(filters);
  let tagsFilterString = buildTagsFilterString(tags, filters);
  let workloadFilterString = buildWorkloadFiltersString(workloadFilters);
  return `?${limitOffsetString}${sortString}${filterString}${tagsFilterString}${workloadFilterString}`;
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
