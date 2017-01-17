import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  notifications:[],
 
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    
    case ActionTypes.ADD_NOTIFICATIONS:
      return {...state,notifications:action.payload};

   
    default:
      return state;
  }
};
