/**
 * User Reducer
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import * as ActionTypes from '../types'; 

// Set initial state
const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_USER_DETAILS:
      return { ...state, userdetails : action.payload};
 
 	case ActionTypes.LOGOUT:
      return { ...state,};
 
    default:
      return state;
  }
}
