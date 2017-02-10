import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  teamname : '',
  description :'',
  loading: false,
  teamerror:'',
  teamsuccess:'',
  teams:[],
  teamagents:[],
  myteams: [],
  teamediterror : '',
  teameditsuccess:'',
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    case ActionTypes.REGISTER_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
   
    case ActionTypes.ADD_TEAMS:
      return {...state,teams:action.payload,teamagents : state.teamagents,teamerror: '',teamsuccess:'',  teamediterror : '',
  teameditsuccess:''};
    case ActionTypes.ADD_TEAM_AGENTS:
      return {...state,teams:state.teams,teamagents : action.payload,teamerror: '',teamsuccess:'',  teamediterror : '',
  teameditsuccess:''};
    case ActionTypes.ADD_MY_TEAMS:
         return {...state,myteams:action.payload,teamagents : state.teamagents,teamerror: '',teamsuccess:'',  teamediterror : '',
  teameditsuccess:''};
   
 
   case ActionTypes.CREATE_TEAM:
      return { ...state, loading: true, teamerror: '',teamsuccess:'',  teamediterror : '',
  teameditsuccess:'',};
    case ActionTypes.CREATE_TEAM_SUCCESS:
      return { ...state, ...INITIAL_STATE, teamsuccess: 'Team created successfully' };
    case ActionTypes.CREATE_TEAM_FAIL:
      return { ...state, teamerror: 'Team creation failed', loading: false };
    

    case ActionTypes.EDIT_TEAM:
      return { ...state, teams:state.teams,teamagents : state.teamagents,loading: true, teamerror: '',teamsuccess:'' ,teamediterror : '',teameditsuccess:''};
    case ActionTypes.EDIT_TEAM_SUCCESS:
      return { ...state, ...INITIAL_STATE, teams:state.teams,teamagents : state.teamagents,teameditsuccess: 'Team edited successfully' };
    case ActionTypes.EDIT_TEAM_FAIL:
      return { ...state, teamediterror: 'Team update failed', teams:state.teams,teamagents : state.teamagents,loading: false };


     case ActionTypes.DELETE_TEAM_SUCCESS:
      return { ...state, teameditsuccess: 'Team deleted successfully',teams:state.teams,teamagents : state.teamagents, loading: false };
    case ActionTypes.DELETE_TEAM_FAIL:
      return { ...state, teamediterror: 'Team deletion failed', teams:state.teams,teamagents : state.teamagents,loading: false };
   
    default:
      return state;
  }
};
