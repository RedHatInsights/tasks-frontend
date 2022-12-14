import { entitiesReducer } from '../../store/index';
import { createSystemLink } from '../../helpers';

export const systemColumns = [
  {
    key: 'display_name',
    sortKey: 'display_name',
    props: { width: 20 },
    title: 'Name',
    renderFunc: (name, id) => {
      return createSystemLink(id, name, `system-name-${id}`);
    },
  },
  'tags',
  {
    key: 'os_version',
    sortKey: 'os_version',
    props: { width: 10 },
    title: 'OS',
  },
  'updated',
];

export const defaultOnLoad = (columns, getRegistry) => {
  return ({ INVENTORY_ACTION_TYPES, mergeWithEntities }) =>
    getRegistry().register({
      ...mergeWithEntities(entitiesReducer(INVENTORY_ACTION_TYPES, columns), {
        page: 1,
        perPage: 10,
        sortBy: {
          key: 'updated',
          direction: 'desc',
        },
      }),
    });
};
