import { fetchSystems } from '../../../api';
import { buildFilterSortString } from './helpers';

export const useGetEntities = (
  onComplete,
  { selectedIds, setFilterSortString, slug }
) => {
  return async (_items, config) => {
    const {
      page,
      per_page: perPage,
      orderBy,
      orderDirection,
      filters,
      tags,
      workloadFilters,
      activeFiltersConfig,
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
      workloadFilters,
      activeFiltersConfig
    );
    const fetchedEntities = await fetchSystems(filterSortString, slug);

    const {
      data,
      meta: { count },
    } = fetchedEntities || {};

    const bulkFilterSortString = filterSortString.replace(
      /(limit=)[^&]+/,
      '$1' + count
    );
    setFilterSortString(bulkFilterSortString);

    onComplete && onComplete(fetchedEntities);

    const results = data.map((entity) => ({
      ...entity,
      selected: (selectedIds || []).map((id) => id).includes(entity.id),
      // disables the bulkSelect checkbox if the entity/row has any requirements
      disableSelection: entity.requirements.length || !entity.connected,
      // for populating the eligibility column and the tooltip for ineligible systems
      eligibility: {
        title: entity.requirements.length ? 'Not eligible' : 'Eligible',
        tooltip: entity.requirements.join('. '), // '' if no requirements
      },
      updated: entity.last_check_in,
    }));

    return {
      results,
      page,
      perPage,
      orderBy,
      orderDirection,
      total: count,
    };
  };
};
