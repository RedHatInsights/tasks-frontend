import { fetchSystems } from '../../../api';
import { buildFilterSortString } from './helpers';

export const useGetEntities = (onComplete, { selectedIds }) => {
  return async (_items, config) => {
    const {
      page,
      per_page: perPage,
      orderBy,
      orderDirection,
      filters,
      tags,
      workloadFilters,
    } = config;
    const limit = perPage;
    const offset = page * perPage - perPage;
    const filterSortString = buildFilterSortString(
      limit,
      offset,
      orderBy,
      orderDirection,
      filters,
      tags,
      workloadFilters
    );
    const fetchedEntities = await fetchSystems(filterSortString);

    const {
      data,
      meta: { count },
    } = fetchedEntities || {};

    onComplete && onComplete(fetchedEntities);

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
