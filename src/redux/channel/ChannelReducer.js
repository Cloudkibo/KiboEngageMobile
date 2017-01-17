import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  channels:[],
 
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    
    case ActionTypes.ADD_CHANNELS:
      return {...state,channels:action.payload};

   
    default:
      return state;
  }
};
