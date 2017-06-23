import * as ActionTypes from '../types';

const INITIAL_STATE = {
  teams: [],
  loading: false,
  teamerror:'',
  teamsuccess:'',
  teamagents:[],
  myteams:[],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.ADD_TEAMS:
      return { ...state, teams: action.payload,teamerror:'',teamsuccess:'',teamagents:state.teamagents, myteams:state.myteams};
    case ActionTypes.ADD_MY_TEAMS:
      return { ...state, teams: state.teams,myteams:action.payload,teamerror:'',teamsuccess:'',teamagents:state.teamagents};
   
    case ActionTypes.CREATE_TEAM_SUCCESS:
      return { ...state, ...INITIAL_STATE,teams : state.teams,teamerror: '', teamsuccess: 'Team created successfully',myteams:state.myteams };
    case ActionTypes.CREATE_TEAM_FAIL:
      return { ...state, teams : state.teams,myteams:state.myteams,loading: false,teamerror:'There is an error occur while creating team. Please Try again', teamsuccess:'' };

    case ActionTypes.ADD_TEAM_AGENTS:
      return {...state,teams:state.teams,myteams:state.myteams,teamagents : action.payload,teamerror:'',teamsuccess:''};
    case ActionTypes.EDIT_TEAM_SUCCESS:
      return { ...state,myteams:state.myteams,teams : state.teams,teamerror: '', teamsuccess: 'Team details updated successfully',teamagents:state.teamagents };
    case ActionTypes.EDIT_TEAM_FAIL:
      return { ...state, teams : state.teams,myteams:state.myteams,loading: false,teamerror:'There is an error occur while updating team. Please Try again', teamsuccess:'' ,teamagents:state.teamagents};

   case ActionTypes.DELETE_TEAM_SUCCESS:
      return { ...state,myteams:state.myteams,teams : state.teams,teamerror: '', teamsuccess: 'Team deleted successfully',teamagents:state.teamagents };
    case ActionTypes.DELETE_TEAM_FAIL:
      return { ...state, teams : state.teams,myteams:state.myteams,loading: false,teamerror:'There is an error occur while deleting team. Please Try again', teamsuccess:'' ,teamagents:state.teamagents};

    case ActionTypes.JOIN_TEAM_SUCCESS:
      return { ...state,myteams:state.myteams,teams : state.teams,teamerror: '', teamsuccess: 'Team joined successfully',teamagents:state.teamagents };
    case ActionTypes.JOIN_TEAM_FAIL:
      return { ...state, teams : state.teams,myteams:state.myteams,loading: false,teamerror:'There is an error occur while joining this team. Please Try again', teamsuccess:'' ,teamagents:state.teamagents};

 
    default:
      return state;
  }
};
