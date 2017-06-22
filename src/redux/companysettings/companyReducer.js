import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  
  data: [],
  updateSettings: '',
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
   case ActionTypes.FETCH_SETTINGS:
      return {...state,data:[action.payload], updateSettings: ''};
    
   case ActionTypes.UPDATE_SETTINGS:
      return {...state,updateSettings:action.payload};
  case ActionTypes.RESET_STATUS:
      return {...state,updateSettings:''};
  
   
    default:
      return state;
  }
};
