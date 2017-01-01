import * as ActionTypes from '../actions/types'; 

const INITIAL_STATE = {
  teamname : '',
  description :''

};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    case ActionTypes.REGISTER_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
   
    default:
      return state;
  }
};
