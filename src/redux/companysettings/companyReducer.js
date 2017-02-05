import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  
  data: [],
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
   case ActionTypes.FETCH_SETTINGS:
      return {...state,data:[action.payload]};
  
   
    default:
      return state;
  }
};
