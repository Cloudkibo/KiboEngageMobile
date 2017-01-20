import * as ActionTypes from '../types';

const INITIAL_STATE = {
  groups: [],
  loading: false,
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.ADD_GROUPS:
      return { ...state, groups: action.payload};

    default:
      return state;
  }
};
