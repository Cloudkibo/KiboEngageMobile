import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  
  loading: false,
  agents:[],
  invite: '',
  status:'',
  statuscode:'',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
   case ActionTypes.ADD_AGENTS:
      return {...state,agents:action.payload,status:'',statuscode: ''};
  
   case ActionTypes.INVITE_AGENTS:
      return {...state,invite:action.payload,status:'',statuscode: ''};
   case ActionTypes.AGENT_ROLE_UPDATE:
       return {...state,statuscode: action.payload,status:action.payload == 200?"Agent role updated successfully":"Something went wrong while updaing agent role."};

  case ActionTypes.AGENT_DELETE:
      return {...state,agents:action.payload == 200?state.agents.filter((c)=>c._id != action.agent._id):state.agents,statuscode: action.payload,status:action.payload == 200?"Agent deleted successfully":"Something went wrong while deleting agent."};
    default:
      return state;
  }
};
