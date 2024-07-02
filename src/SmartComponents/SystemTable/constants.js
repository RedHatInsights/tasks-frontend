import { entitiesReducer } from '../../store/index';
import {
  createConnectedIcon,
  createEligibilityTooltip,
  createSystemLink,
} from '../../helpers';

export const systemColumns = (isBeta) => [
  {
    key: 'display_name',
    sortKey: 'display_name',
    props: { width: 20 },
    title: 'Name',
    renderFunc: (name, id) => {
      return createSystemLink(id, name, `system-name-${id}`, isBeta);
    },
  },
  {
    key: 'eligibility',
    props: { width: 10, isStatic: true }, // column isn't sortable
    title: 'Eligibility',
    renderFunc: (eligibility) => {
      return createEligibilityTooltip(eligibility);
    },
  },
  {
    key: 'connected',
    props: { width: 10, isStatic: true }, // column isn't sortable
    title: 'Connection Status',
    renderFunc: (connected) => {
      return createConnectedIcon(connected);
    },
  },
  'groups',
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

export const ELIGIBLE_SYSTEMS = 'Eligible Systems';
export const ALL_SYSTEMS = 'All Systems';
export const eligibilityFilterItems = [
  { label: ELIGIBLE_SYSTEMS, value: ELIGIBLE_SYSTEMS },
  { label: ALL_SYSTEMS, value: ALL_SYSTEMS },
];

// Max systems we can ask for from the API, otherwise the connected status
// may be incorrect, due to limitations of other internal services
export const API_MAX_SYSTEMS = 100;
