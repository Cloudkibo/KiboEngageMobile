/**
 * Tabs Scenes
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import { Scene } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { AppStyles, AppSizes } from '@theme/';

// Components
import { TabIcon } from '@ui/';
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

// Scenes
import Agents from '@containers/Agents/Agents';
import Placeholder from '@components/general/Placeholder';
import StyleGuide from '@containers/StyleGuideView';
import Recipes from '@containers/recipes/Browse/BrowseContainer';
import RecipeView from '@containers/recipes/RecipeView';
import Dashboard from '@containers/dashboard';
//import DashboardiOS from '@containers/dashboardiOS';
//const Dashboard = require('@containers/dashboard');
var ReactNative = require('react-native');
/*var Dashboard = ReactNative.Platform.select({
  ios: () => require('@containers/dashboardiOS'),
  android: () => require('@containers/dashboard'),
})();
*/
const navbarPropsTabs = {
  ...AppConfig.navbarProps,
  renderLeftButton: () => <NavbarMenuButton />,
  sceneStyle: {
    ...AppConfig.navbarProps.sceneStyle,
    paddingBottom: AppSizes.tabbarHeight,
  },
};

/* Routes ==================================================================== */
const scenes = (
  <Scene key={'tabBar'} tabs tabBarIconContainerStyle={AppStyles.tabbar} pressOpacity={0.95}>
     
      <Scene
        {...navbarPropsTabs}
        key={'groupListing'}
        title={'Dashboard'}
        component={Dashboard}
        analyticsDesc={'Dashboard'}
      />
    
    
   
  </Scene>
    
);
const scenesagent = (
 
<Scene key={'agenttabBar'} tabs tabBarIconContainerStyle={AppStyles.tabbar} pressOpacity={0.95}>
     
      <Scene
        {...navbarPropsTabs}
        key={'groupListing'}
        title={'Dashboard'}
        component={Agent}
        analyticsDesc={'Dashboard'}
      />
    
    
   
  </Scene>
  );

export default scenes,scenesagent;
