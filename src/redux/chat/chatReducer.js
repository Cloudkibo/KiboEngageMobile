import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  
  data: '',
  loading: true,
  chat: '',
  singleChat: '',
  invite_agent_status: '',
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
   case ActionTypes.FETCH_SESSIONS:
      return {...state,data:action.payload, loading:false};

   case ActionTypes.FETCH_CHATS:
      return {...state,chat:action.payload, loading:false};
   
   case ActionTypes.SINGLE_CHATS:
      return {...state,singleChat:action.payload, loading:false};
  case ActionTypes.ASSIGN_AGENT:
      return {...state,invite_agent_status:action.payload};
    
   
    default:
      return state;
  }
};
