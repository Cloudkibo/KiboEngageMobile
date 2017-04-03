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
import subgroups from '@redux/subgroup/SubgroupReducer';
import customers from '@redux/Customers/CustomersReducer';
import groups from '@redux/group/GroupReducer';
import company from '@redux/companysettings/companyReducer';
import chat from '@redux/chat/chatReducer';
import fbpages from '@redux/facebook/FbPageReducer';
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
  subgroups,
  customers,
  groups,
  company,
  chat,
  fbpages
});

// Setup root reducer
const rootReducer = (state, action) => {
  const newState = (action.type === 'RESET') ? undefined : state;
  return appReducer(newState, action);
};

export default rootReducer;
