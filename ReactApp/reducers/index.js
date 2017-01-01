/**
 * Combine All Reducers
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
'use strict';

import { combineReducers } from 'redux'

// Our custom reducers
// We need to import each one here and add them to the combiner at the bottom
import sideMenu from './sidemenu'
import AuthReducer from './AuthReducer';
import TeamReducer from './TeamReducer';

// Combine all
const appReducer = combineReducers({
  sideMenu: sideMenu,
  auth: AuthReducer,
  team: TeamReducer,
});

// Setup root reducer
const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer
