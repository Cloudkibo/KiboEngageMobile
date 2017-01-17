/**
 * Combine All Reducers
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

import { combineReducers } from 'redux';

// Our custom reducers
// We need to import each one here and add them to the combiner at the bottom
import router from '@redux/router/reducer';
import sideMenu from '@redux/sidemenu/reducer';
import user from '@redux/user/reducer';
import recipe from '@redux/recipes/reducer';
import auth from '@redux/auth/AuthReducer';
import teams from '@redux/team/TeamReducer';
import agents from '@redux/agents/AgentReducer';
import cannedresponses from '@redux/cannedresponse/CannedReducer';
import notifications from '@redux/notification/NotificationReducer';
import channels from '@redux/channel/ChannelReducer';

// Combine all
const appReducer = combineReducers({
  router,
  sideMenu,
  user,
  recipe,
  auth,
  teams,
  agents,
  cannedresponses,
  notifications,
  channels
});

// Setup root reducer
const rootReducer = (state, action) => {
  const newState = (action.type === 'RESET') ? undefined : state;
  return appReducer(newState, action);
};

export default rootReducer;
