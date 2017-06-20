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
      return { ...state, userdetails : action.payload, fetchedR:state.fetchedR, profileError: '', profileSuccess: ''};

    case ActionTypes.ADD_FETCHED_RESULT:
     return { ...state, userdetails : state.userdetails,fetchedR:action.payload};

    case ActionTypes.LOGOUT:
      return { ...state };

    case ActionTypes.UPDATE_PROFILE_SUCCESS:
      return { ...state, profileError: '', profileSuccess: 'Profile updated successfully' };
    case ActionTypes.UPDATE_PROFILE_FAIL:
      return { ...state, profileError: 'There is an error occur while updating profile. Please Try again', profileSuccess: '' };

    default:
      return state;
  }
}
