import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  
  loading: false,
  agents:[],

  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
   case ActionTypes.ADD_AGENTS:
      return {...state,agents:action.payload};
 
   
    default:
      return state;
  }
};
