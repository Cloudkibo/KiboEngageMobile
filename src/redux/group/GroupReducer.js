import * as ActionTypes from '../types';

const INITIAL_STATE = {
  groupname : '',
  description :'',
  loading: false,
  grouperror:'',
  groupsuccess:'',
  groups:[],
  groupagents:[],
  mygroups: [],
  groupediterror : '',
  groupeditsuccess:'',
  deptteams: [],
  newteams: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.REGISTER_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };

    case ActionTypes.ADD_GROUPS:
      return {...state,groups:action.payload,groupagents : state.groupagents,grouperror: '',groupsuccess:'',  groupediterror : '',
  groupeditsuccess:''};
    case ActionTypes.ADD_GROUP_AGENTS:
      return {...state,groups:state.groups,groupagents : action.payload,grouperror: '',groupsuccess:''};
    case ActionTypes.ADD_MY_GROUPS:
         return {...state,mygroups:action.payload.createdDept?action.payload.createdDept:[],groupagents : state.groupagents,grouperror: '',groupsuccess:''};


   case ActionTypes.CREATE_GROUP:
      return { ...state, loading: true, grouperror: '',groupsuccess:'',  groupediterror : '',
  groupeditsuccess:'',};
    case ActionTypes.CREATE_GROUP_SUCCESS:
      return { ...state, groupsuccess: 'Group created successfully' };
    case ActionTypes.CREATE_GROUP_FAIL:
      return { ...state, grouperror: 'Group creation failed', loading: false };


    case ActionTypes.EDIT_GROUP:
      return { ...state, groups:state.groups,groupagents : state.groupagents,loading: true, grouperror: '',groupsuccess:'' ,groupediterror : '',groupeditsuccess:''};
    case ActionTypes.EDIT_GROUP_SUCCESS:
      return { ...state, groups:state.groups,groupagents : state.groupagents,groupeditsuccess: 'Group edited successfully' };
    case ActionTypes.EDIT_GROUP_FAIL:
      return { ...state, groupediterror: 'Group update failed', groups:state.groups,groupagents : state.groupagents,loading: false };


     case ActionTypes.DELETE_GROUP_SUCCESS:
      return { ...state, groupeditsuccess: 'Group deleted successfully',groups:state.groups,groupagents : state.groupagents, loading: false };
    case ActionTypes.DELETE_GROUP_FAIL:
      return { ...state, groupediterror: 'Group deletion failed', groups:state.groups,groupagents : state.groupagents,loading: false };
    case ActionTypes.RESET_GROUP_EDIT:
      return { ...state, groupediterror: '', groupeditsuccess: ''};
      case ActionTypes.ADD_DEPTTEAMS:
        return { ...state, deptteams: action.payload, newteams: [] };

    default:
      return state;
  }
};
