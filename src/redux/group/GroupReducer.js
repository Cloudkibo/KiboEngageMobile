import * as ActionTypes from '../types';

const INITIAL_STATE = {
  groups: [],
  loading: false,
  grouperror:'',
  groupsuccess:'',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.ADD_GROUPS:
      return { ...state, groups: action.payload,grouperror:'',groupsuccess:''};
    case ActionTypes.CREATE_GROUP_SUCCESS:
      return { ...state, ...INITIAL_STATE,groups : state.groups,grouperror: '', groupsuccess: 'Group created successfully' };
    case ActionTypes.CREATE_GROUP_FAIL:
      return { ...state, groups : state.groups,loading: false,grouperror:'There is an error occur while creating group. Please Try again', groupsuccess:'' };

    default:
      return state;
  }
};
