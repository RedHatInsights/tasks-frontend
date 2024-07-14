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
    const isEligible = (item) => item?.requirements?.length === 0;
    const isConnected = (item) => item?.connected;

    switch (type) {
      case 'none': {
        setSelectedIds([]);
        break;
      }

      case 'page': {
        options.items.forEach((item) => {
          if (
            !newSelectedIds.includes(item.id) &&
            isEligible(item) &&
            isConnected(item)
          ) {
            newSelectedIds.push(item.id);
          }
        });

        setSelectedIds(newSelectedIds);
        break;
      }

      case 'all': {
        // The Tasks API paginator responds with a maximum of 1000 systems, even if the account has more
        // than 1000 systems and the request params contain something like '/systems?limit=20000&offset=0'.
        // So we retrieve systems in batches of 1000, regardless of the number of systems
        // TBH though, this doesn't scale very well if selecting many thousands systems (eg 5000+)
        const batchSize = 1000;
        const pages = Math.ceil(options.total / batchSize) || 1;
        let allSystems = await options.resolve(
          [...new Array(pages)].map(
            (_, pageIdx) => () =>
              fetchSystems(
                filterSortString
                  .replace(/limit=\d+/, `limit=${batchSize}`)
                  .replace(/offset=\d+/, `offset=${batchSize * pageIdx}`),
                slug
              )
          )
        );
        // extract all the 'data' arrays and merge them into a single array
        const eligibleIds = allSystems
          .map((batch) => batch.data)
          .flat()
          .filter((item) => isEligible(item) && isConnected(item))
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
