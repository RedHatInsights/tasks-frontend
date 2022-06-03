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

  return `${displayNameFilter}`;
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
