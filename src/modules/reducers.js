import types from './types';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';

export const globalFilterReducer = applyReducerHash({
  [types.SET_GLOBAL_FILTER_TAGS]: (state = {}, action) => ({
    ...state,
    tagsFilter: action.payload,
  }),
  [types.SET_GLOBAL_FILTER_WORKLOADS]: (state = {}, action) => ({
    ...state,
    workloadsFilter: action.payload,
  }),
  [types.SET_GLOBAL_FILTER_SIDS]: (state = {}, action) => ({
    ...state,
    sidsFilter: action.payload,
  }),
});
