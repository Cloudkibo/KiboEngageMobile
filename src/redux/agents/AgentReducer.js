import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  
  loading: false,
  agents:[],
  invite: '',
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
   case ActionTypes.ADD_AGENTS:
      return {...state,agents:action.payload};
  
   case ActionTypes.INVITE_AGENTS:
      return {...state,invite:action.payload};
   
    default:
      return state;
  }
};
