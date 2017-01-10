import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  teamname : '',
  description :'',
  loading: false,
  teamerror:'',
  teamsuccess:'',
  teams:[],
  teamagents:[],

  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    case ActionTypes.REGISTER_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
   
    case ActionTypes.ADD_TEAMS:
      return {...state,teams:action.payload,teamagents : state.teamagents,teamerror: '',teamsuccess:''};
    case ActionTypes.ADD_TEAM_AGENTS:
      return {...state,teams:state.teams,teamagents : action.payload,teamerror: '',teamsuccess:''};
   
 
   case ActionTypes.CREATE_TEAM:
      return { ...state, loading: true, teamerror: '',teamsuccess:'' };
    case ActionTypes.CREATE_TEAM_SUCCESS:
      return { ...state, ...INITIAL_STATE, teamsuccess: 'Team created successfully' };
    case ActionTypes.CREATE_TEAM_FAIL:
      return { ...state, teamerror: 'Team creation failed', loading: false };
    

     case ActionTypes.DELETE_TEAM_SUCCESS:
      return { ...state, teamsuccess: 'Team deleted successfully', loading: false };
    case ActionTypes.DELETE_TEAM_FAIL:
      return { ...state, teamerror: 'Team deletion failed', loading: false };
   
    default:
      return state;
  }
};
