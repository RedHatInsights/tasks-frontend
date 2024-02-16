import { fetchSystems } from '../../../../api';

export const useSystemBulkSelect = (
  selectedIds,
  setSelectedIds,
  filterSortString,
  slug
) => {
  const bulkSelectIds = async (type, options) => {
    let newSelectedIds = [...selectedIds];
    // only bulkSelect items that have no requirements
    const isEligible = (item) => !item.requirements.length;

    switch (type) {
      case 'none': {
        setSelectedIds([]);
        break;
      }

      case 'page': {
        options.items.forEach((item) => {
          if (!newSelectedIds.includes(item.id) && isEligible(item)) {
            newSelectedIds.push(item.id);
          }
        });

        setSelectedIds(newSelectedIds);
        break;
      }

      case 'all': {
        const allSystems = await fetchSystems(filterSortString, slug);
        const eligibleIds = allSystems.data
          .filter((item) => isEligible(item))
          .map((item) => item.id);
        setSelectedIds(eligibleIds);
        break;
      }
    }
  };

  const selectIds = (_event, _isSelected, _index, entity) => {
    let newSelectedIds = [...selectedIds];

    !newSelectedIds.includes(entity.id)
      ? newSelectedIds.push(entity.id)
      : newSelectedIds.splice(newSelectedIds.indexOf(entity.id), 1);

    setSelectedIds(newSelectedIds);
  };
  return { bulkSelectIds, selectIds };
};
