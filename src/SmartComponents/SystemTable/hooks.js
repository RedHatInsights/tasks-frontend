import { fetchSystems } from '../../../api';
import { buildFilterSortString } from './helpers';

export const useGetEntities = (selectedIds) => {
  return async (
    _items,
    { page = 1, per_page: perPage, orderBy, orderDirection, filters }
  ) => {
    const limit = perPage;
    const offset = page * perPage - perPage;
    const filterSortString = buildFilterSortString(
      limit,
      offset,
      orderBy,
      orderDirection,
      filters
    );
    const fetchedEntities = await fetchSystems(filterSortString);

    const {
      data,
      meta: { count },
    } = fetchedEntities || {};

    return {
      results: data.map((entity) => ({
        ...entity,
        selected: (selectedIds || []).map((id) => id).includes(entity.id),
      })),
      page,
      perPage,
      orderBy,
      orderDirection,
      total: count,
    };
  };
};
