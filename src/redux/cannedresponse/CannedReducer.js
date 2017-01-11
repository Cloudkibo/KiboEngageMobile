import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  cannedresponses:[],
 
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    
    case ActionTypes.ADD_CANNED_RESPONSES:
      return {...state,cannedresponses:action.payload};
    default:
      return state;
  }
};
