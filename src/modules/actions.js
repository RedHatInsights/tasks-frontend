import types from './types';

function setGlobalFilterTags(tags = []) {
  return {
    type: types.SET_GLOBAL_FILTER_TAGS,
    payload: tags,
  };
}

function setGlobalFilterWorkloads(workloads = []) {
  return {
    type: types.SET_GLOBAL_FILTER_WORKLOADS,
    payload: workloads,
  };
}

function setGlobalFilterSIDs(SIDs = []) {
  return {
    type: types.SET_GLOBAL_FILTER_SIDS,
    payload: SIDs,
  };
}

export default {
  setGlobalFilterTags,
  setGlobalFilterWorkloads,
  setGlobalFilterSIDs,
};
