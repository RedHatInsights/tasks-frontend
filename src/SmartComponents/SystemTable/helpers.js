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

  let osFilter = '';
  for (const majorVer in filters.osFilter) {
    for (const majMinVer in filters.osFilter[majorVer]) {
      if (filters.osFilter[majorVer][majMinVer]) {
        osFilter += `&os_version=${majMinVer}`;
      }
    }
  }

  return `${displayNameFilter}${osFilter}`;
};

export const buildFilterSortString = (
  limit,
  offset,
  orderBy,
  orderDirection,
  filters
) => {
  let limitOffsetString = `limit=${limit}&offset=${offset}`;
  let sortString = buildSortString(orderBy, orderDirection);
  let filterString = buildFilterString(filters);
  return `?${limitOffsetString}${sortString}${filterString}`;
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
