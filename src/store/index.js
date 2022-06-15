import { createContext } from 'react';
import {
  ReducerRegistry,
  applyReducerHash,
} from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

let registry;

export const RegistryContext = createContext({
  getRegistry: () => {},
});

export function init(...middleware) {
  registry = new ReducerRegistry({}, [
    promiseMiddleware,
    notificationsMiddleware({ errorDescriptionKey: ['detail', 'stack'] }),
    ...middleware,
  ]);
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
    ['SELECT_ENTITY']: (state, { payload: { selected } }) => {
      return {
        ...state,
        rows: selectRows(state.rows || [], selected),
      };
    },
  });
