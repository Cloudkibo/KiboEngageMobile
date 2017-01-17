import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  customers:[],
 
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    
    case ActionTypes.ADD_CUSTOMERS:
      return {...state,customers:action.payload};

   
    default:
      return state;
  }
};
