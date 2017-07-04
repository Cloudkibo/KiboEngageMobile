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

import Placeholder from '@components/general/Placeholder';
import StyleGuide from '@containers/StyleGuideView';
import Recipes from '@containers/recipes/Browse/BrowseContainer';
import RecipeView from '@containers/recipes/RecipeView';
import Dashboard from '@containers/dashboard';
import ChatSession from '@containers/Chat/ChatSession';
import GroupsMain from '@containers/Groups/GroupsMain';

import Customers from '@containers/CustomerDirectory/Customers';
import Subgroups from '@containers/SubGroups/Subgroups';

import Agents from '@containers/Agents/Agents';
import TeamsMain from '@containers/Teams/TeamsMain';

import FBPages from '@containers/Facebook/FBPages';
import Notifications from '@containers/Notifications/Notifications';
import Cannedresponse from '@containers/CannedResponses/Cannedresponse';

import FbChat from '@containers/Facebook/FbChat';
import Reports from '@containers/Reports/Reports';
import MyProfile from '@containers/MyProfile/MyProfile';
import CompanySettings from '@containers/CompanySettings/CompanySettings';

import FbCustomers from '@containers/Facebook/FbCustomers';

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
    //paddingBottom: AppSizes.tabbarHeight,
     paddingBottom: 10,
    paddingTop: 0,
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

       
         <Scene
         {...navbarPropsTabs}
        key={'dashboard'}
        title={'Dashboard'}
        component={Dashboard}
        analyticsDesc={'Placeholder: Coming Soon'}
      />
    
      <Scene
         {...navbarPropsTabs}
        key={'ChatSession'}
        title={'ChatSession'}
        component={ChatSession}
        analyticsDesc={'Placeholder: Coming Soon'}
      />

      <Scene
       {...navbarPropsTabs}
        key={'companySettings'}
        title={'Company Settings'}
        component={CompanySettings}
        analyticsDesc={'Placeholder: Coming Soon'}
      />


     <Scene
      {...navbarPropsTabs}
        key={'groupsmain'}
        title={'Groups'}
        component={GroupsMain}
        analyticsDesc={'Groups: Groups'}
      />
       

       <Scene
        {...navbarPropsTabs}
        key={'subgroups'}
        title={'Sub Groups'}
        onRight={() => Actions.channelCreate()}
        rightTitle="Add"
        rightButtonTextStyle={{ color: 'white' }}
        barButtonTextStyle={{ color: '#FFFFFF' }}
        component={Subgroups}
        analyticsDesc={'Subgroup: Subgroup'}
      />

      <Scene
      {...navbarPropsTabs}
        key={'teamsmain'}
        title={'Teams'}

        component={TeamsMain}
        analyticsDesc={'Teams Main: Teams'}
      />

      <Scene
        {...navbarPropsTabs}
        key={'notifications'}
        title={'Notifications'}
        onRight={() => Actions.addNotification()}
        rightTitle="Add"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        component={Notifications}
        analyticsDesc={'Notifications: Notifications'}
      />

        <Scene
        {...navbarPropsTabs}
        key={'cannedresponse'}
        title={'Canned Responses'}
        component={Cannedresponse}
        onRight={() => Actions.cannedCreate()}
        rightTitle="Add"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        analyticsDesc={'Cannedresponse: Cannedresponse'}
      />

      <Scene
      {...navbarPropsTabs}
        key={'reports'}
        title={'Reports'}
        component={Reports}
        analyticsDesc={'Reports'}
      />

      <Scene
      {...navbarPropsTabs}
        key={'agents'}
        title={'Agents'}
        onRight={() => Actions.inviteAgent()}
        rightTitle="Invite"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        component={Agents}
        analyticsDesc={'Agents:Agents'}
      />

       <Scene
       {...navbarPropsTabs}
        key={'myProfile'}
        title={'My Profile'}
        component={MyProfile}
        analyticsDesc={'MyProfile: MyProfile'}
      />

       <Scene
       {...navbarPropsTabs}
        key={'fbpages'}
        title={'Facebook Pages'}
        onRight={() => Actions.AddFbPage()}
        rightTitle="Add"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        component={FBPages}
        analyticsDesc={'FBPages: FBPages'}
      />

       <Scene
       {...navbarPropsTabs}
        key={'fbChats'}
        title={'Chat'}
        component={FbChat}
        onRight={() => Actions.FbSettings()}
        rightTitle="Settings"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        analyticsDesc={'FbChat: FbChat'}
      />
   
      <Scene
       {...navbarPropsTabs}
        key={'customers'}
        title={'Customers'}
        component={Customers}
        analyticsDesc={'Customers: Customers'}
      />

      <Scene
       {...navbarPropsTabs}
        key={'FbCustomers'}
        title={'Facebook Customers'}
        component={FbCustomers}
        analyticsDesc={'FbCustomers: FbCustomers'}
      />
  </Scene>
);

export default scenes;
