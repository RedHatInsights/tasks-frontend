import { createContext } from 'react';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

let registry;

export const RegistryContext = createContext({
  getRegistry: () => {},
});

export function init(...middleware) {
  registry = getRegistry({}, [
    promiseMiddleware,
    ...middleware.filter((item) => typeof item !== 'undefined'),
  ]);

  registry.register({ notifications: notificationsReducer });
  return registry;
}

export function getStore() {
  return registry.getStore();
}

const selectRows = (rows, selected) =>
  rows.map((row) => ({
    ...row,
    selected: selected.includes(row.id),
  }));

export const entitiesReducer = () =>
  applyReducerHash({
    ['INVENTORY_INIT']: () => ({
      rows: [],
      total: 0,
    }),
    ['RESET_PAGE']: (state) => ({
      ...state,
      page: 1,
      perPage: 10,
    }),
    ['SELECT_ENTITIES']: (state, { payload: { selected } }) => {
      return {
        ...state,
        rows: selectRows(state.rows || [], selected),
      };
    },
  });
