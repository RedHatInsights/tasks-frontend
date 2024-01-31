import { fetchSystems } from '../../../../api';

export const useSystemBulkSelect = (
  selectedIds,
  setSelectedIds,
  filterSortString,
  slug
) => {
  const bulkSelectIds = async (type, options) => {
    let newSelectedIds = [...selectedIds];

    switch (type) {
      case 'none': {
        setSelectedIds([]);
        break;
      }

      case 'page': {
        options.items.forEach((item) => {
          if (!newSelectedIds.includes(item.id)) {
            newSelectedIds.push(item.id);
          }
        });

        setSelectedIds(newSelectedIds);
        break;
      }

      case 'all': {
        let results = await fetchSystems(filterSortString, slug);
        setSelectedIds(results.data.map(({ id }) => id));
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
