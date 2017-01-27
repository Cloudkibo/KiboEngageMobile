import * as ActionTypes from '../types';

const INITIAL_STATE = {
  groups: [],
  loading: false,
  grouperror:'',
  groupsuccess:'',
  groupagents:[],
  mygroups:[],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.ADD_GROUPS:
      return { ...state, groups: action.payload,grouperror:'',groupsuccess:'',groupagents:state.groupagents, mygroups:state.mygroups};
    case ActionTypes.ADD_MY_GROUPS:
      return { ...state, groups: state.groups,mygroups:action.payload,grouperror:'',groupsuccess:'',groupagents:state.groupagents};
   
    case ActionTypes.CREATE_GROUP_SUCCESS:
      return { ...state, ...INITIAL_STATE,groups : state.groups,grouperror: '', groupsuccess: 'Group created successfully',mygroups:state.mygroups };
    case ActionTypes.CREATE_GROUP_FAIL:
      return { ...state, groups : state.groups,mygroups:state.mygroups,loading: false,grouperror:'There is an error occur while creating group. Please Try again', groupsuccess:'' };

    case ActionTypes.ADD_GROUP_AGENTS:
      return {...state,groups:state.groups,mygroups:state.mygroups,groupagents : action.payload,grouperror:'',groupsuccess:''};
    case ActionTypes.EDIT_GROUP_SUCCESS:
      return { ...state, ...INITIAL_STATE,mygroups:state.mygroups,groups : state.groups,grouperror: '', groupsuccess: 'Group details updated successfully',groupagents:state.groupagents };
    case ActionTypes.EDIT_GROUP_FAIL:
      return { ...state, groups : state.groups,mygroups:state.mygroups,loading: false,grouperror:'There is an error occur while updating group. Please Try again', groupsuccess:'' ,groupagents:state.groupagents};

   case ActionTypes.DELETE_GROUP_SUCCESS:
      return { ...state, ...INITIAL_STATE,mygroups:state.mygroups,groups : state.groups,grouperror: '', groupsuccess: 'Group deleted successfully',groupagents:state.groupagents };
    case ActionTypes.DELETE_GROUP_FAIL:
      return { ...state, groups : state.groups,mygroups:state.mygroups,loading: false,grouperror:'There is an error occur while deleting group. Please Try again', groupsuccess:'' ,groupagents:state.groupagents};

    case ActionTypes.JOIN_GROUP_SUCCESS:
      return { ...state, ...INITIAL_STATE,mygroups:state.mygroups,groups : state.groups,grouperror: '', groupsuccess: 'Group joined successfully',groupagents:state.groupagents };
    case ActionTypes.JOIN_GROUP_FAIL:
      return { ...state, groups : state.groups,mygroups:state.mygroups,loading: false,grouperror:'There is an error occur while joining this group. Please Try again', groupsuccess:'' ,groupagents:state.groupagents};

 
    default:
      return state;
  }
};
