/**
 * App Navigation
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import { Actions, Scene, ActionConst } from 'react-native-router-flux';
import { StyleSheet } from 'react-native'
// Consts and Libs
import { AppConfig } from '@constants/';

// Components
import Drawer from '@containers/ui/DrawerContainer';
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

import { AppStyles, AppSizes } from '@theme/';
// Scenes
import AppLaunch from '@containers/Launch/LaunchContainer';
import Groups from '@containers/Groups/Groups';

import ChatSession from '@containers/Chat/ChatSession';
import Chat from '@containers/Chat/Chat';
import ChatSettings from '@containers/Chat/ChatSettings';

import TeamsMain from '@containers/Teams/TeamsMain';
import Agents from '@containers/Agents/Agents';
import EditAgent from '@containers/Agents/EditAgent';
import InviteAgent from '@containers/Agents/InviteAgent';
import GroupsMain from '@containers/Groups/GroupsMain';
import CreateGroup from '@containers/Groups/CreateGroup';
import EditGroup from '@containers/Groups/EditGroup';
import Cannedresponse from '@containers/CannedResponses/Cannedresponse';
import CreateCannedresponse from '@containers/CannedResponses/CreateCannedResponse';
import EditCannedresponse from '@containers/CannedResponses/EditCannedResponse';

import CreateSubGroup from '@containers/SubGroups/CreateSubGroup';
import Subgroups from '@containers/SubGroups/Subgroups';
import EditSubgroup from '@containers/SubGroups/EditSubgroup';

import Teams from '@containers/Teams/Teams';
import CreateTeam  from '@containers/Teams/CreateTeam';
import JoinTeam from '@containers/Teams/JoinTeam';
import EditTeam  from '@containers/Teams/EditTeam';

import Notifications from '@containers/Notifications/Notifications';
import AddNotification from '@containers/Notifications/AddNotification';
import ResendNotification from '@containers/Notifications/ResendNotification';

import Customers from '@containers/CustomerDirectory/Customers';
import CustomerDetailView from '@containers/CustomerDirectory/CustomerDetailView';
import SendEmail from '@containers/CustomerDirectory/SendEmail';
import MyProfile from '@containers/MyProfile/MyProfile';

import CompanySettings from '@containers/CompanySettings/CompanySettings';

import Placeholder from '@components/general/Placeholder';
import Dashboard from '@containers/dashboard';
import AuthScenes from './auth';
import TabsScenes from './tabs';


import AddFbPage from '@containers/Facebook/AddFbPage';
import FBPages from '@containers/Facebook/FBPages';
import EditFbPage from '@containers/Facebook/EditFbPage';
import FbCustomers from '@containers/Facebook/FbCustomers';
import FbChat from '@containers/Facebook/FbChat';
import FbSettings from '@containers/Facebook/FbSettings';
import Reports from '@containers/Reports/Reports';

////rightButtonTextStyle={{ tintColor: 'white' }}
/* Routes ==================================================================== */

const styles = StyleSheet.create({
    rightbarbuttonstyle: {
        color: 'white' 
    },
    });

const navbarPropsTabs = {
  ...AppConfig.navbarProps,
  renderLeftButton: () => <NavbarMenuButton />,
  sceneStyle: {
    ...AppConfig.navbarProps.sceneStyle,
    paddingBottom: AppSizes.tabbarHeight,
  },
};

export default Actions.create(
  <Scene key={'root'} {...AppConfig.navbarProps}>
    <Scene
      hideNavBar
      key={'splash'}
      component={AppLaunch}
      analyticsDesc={'AppLaunch: Launching App'}
    />

    {/* Auth */}
    {AuthScenes}

    {/* Main App */}
    <Scene key={'app'} {...AppConfig.navbarProps} title={AppConfig.appName} hideNavBar={false} type={ActionConst.RESET}>
      {/* Drawer Side Menu */}
      <Scene key={'home'} component={Drawer} initial={'tabBar'}>
        {/* Tabbar */}
        {TabsScenes}
      </Scene>

      {/* General */}
      <Scene
        key={'comingSoon'}
        title={'Coming Soon'}
        component={Placeholder}
        analyticsDesc={'Placeholder: Coming Soon'}
      />
      <Scene
        key={'dashboard'}
        title={'Dashboard'}
        component={Dashboard}
        analyticsDesc={'Placeholder: Coming Soon'}
      />
      <Scene
        key={'ChatSettings'}
        title={'Chat Settings'}
        component={ChatSettings}
        analyticsDesc={'Placeholder: Chat Settings'}
      />

      <Scene
        key={'FbSettings'}
        title={'Facebook Settings'}
        component={FbSettings}
        analyticsDesc={'Placeholder: Facebook Settings'}
      />

      <Scene
        key={'chat'}
        title={'Chat'}
        onRight={() => Actions.ChatSettings()}
        rightTitle="Settings"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        component={Chat}
        analyticsDesc={'Placeholder: Coming Soon'}
      />

      <Scene
        key={'companySettings'}
        title={'Company Settings'}
        component={CompanySettings}
        analyticsDesc={'Placeholder: Coming Soon'}
      />

      <Scene
        key={'ChatSession'}
        title={'ChatSession'}
        component={ChatSession}
        analyticsDesc={'Placeholder: Coming Soon'}
      />

      <Scene
        key={'groupCreate'}
        title={'Create Group2'}
        component={CreateGroup}
        
        hideNavBar={true}
        analyticsDesc={'CreateGroup: Create Group'}
      />
      <Scene
        key={'groups'}
        title={'Groups'}
        onRight={() => Actions.groupCreate()}
        rightTitle="Add"
        component={Groups}
        analyticsDesc={'Groups: Groups'}
      />

      <Scene
        key={'groupsmain'}
        title={'Groups'}
        component={GroupsMain}
        analyticsDesc={'Groups: Groups'}
        //renderBackButton={()=>(null)}
      />

      <Scene
        key={'channelCreate'}
        title={'Create SubGroup'}
        component={CreateSubGroup}
        analyticsDesc={'CreateSubGroup: Create Channel'}
      />
      <Scene
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
        key={'customers'}
        title={'Customers'}
        component={Customers}
        analyticsDesc={'Customers: Customers'}
      />
      <Scene
        key={'customerDetailView'}
        title={'Customer Details'}
        component={CustomerDetailView}
        analyticsDesc={'CustomerDetailView: CustomerDetailView'}
      />
      <Scene
        key={'sendEmail'}
        title={'Send Email'}
        component={SendEmail}
        analyticsDesc={'SendEmail: SendEmail'}
      />

      <Scene
        key={'teams'}
        title={'Teams'}
        onRight={() => Actions.teamCreate()}
        rightTitle="Add"

        component={Teams}
        analyticsDesc={'Teams: Teams'}
      />

      <Scene
        key={'teamsmain'}
        title={'Teams'}

        component={TeamsMain}
        analyticsDesc={'Teams Main: Teams'}
      />

      <Scene
        key={'teamEdit'}
        title={'Edit Team'}
        component={EditTeam}
        analyticsDesc={'EditTeam: Edit Team'}
      />

      <Scene
        key={'editAgent'}
        title={'Edit Agent'}
        component={EditAgent}
        analyticsDesc={'EditAgent: Edit Agent'}
      />

      <Scene
        key={'teamJoin'}
        title={'Join Team'}
        component={JoinTeam}
        analyticsDesc={'JoinGroup: Join Group'}
      />
       <Scene
        key={'teamCreate'}
        title={'Create Team'}
        component={CreateTeam}
        analyticsDesc={'CreateTeam: CreateTeam'}
      />
      <Scene
        key={'addNotification'}
        title={'Add Notification'}
        component={AddNotification}
        analyticsDesc={'AddNotification: Add Notification'}
      />
      <Scene
        key={'notifications'}
        title={'Notifications'}
        onRight={() => Actions.addNotification()}
        rightTitle="Add"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        component={Notifications}
        analyticsDesc={'Notifications: Notifications'}
      />

      <Scene
        key={'cannedCreate'}
        title={'Create Canned Response'}
        component={CreateCannedresponse}
        analyticsDesc={'CreateCannedresponse: CreateCannedresponse'}
      />

       <Scene
        key={'cannedEdit'}
        title={'Edit Canned Response'}
        component={EditCannedresponse}
        analyticsDesc={'EditCannedresponse: EditCannedresponse'}
      />
      <Scene
        key={'cannedresponse'}
        title={'Canned Responses'}
        component={Cannedresponse}
        onRight={() => Actions.cannedCreate()}
        rightTitle="Add"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        analyticsDesc={'Cannedresponse: Cannedresponse'}
      />

      <Scene
        key={'inviteAgent'}
        title={'Invite Agent'}
        component={InviteAgent}
        analyticsDesc={'Agents:Invite Agents'}
      />

      <Scene
        key={'reports'}
        title={'Reports'}
        component={Reports}
        analyticsDesc={'Reports'}
      />

      <Scene
        key={'agents'}
        
        title={'Agents'}
        onLeft={navbarPropsTabs}
        onRight={() => Actions.inviteAgent()}
        rightTitle="Invite"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        component={Agents}
        analyticsDesc={'Agents:Agents'}
      
      />

      <Scene
        key={'groupEdit'}
        title={'Edit Group'}
        component={EditGroup}
        analyticsDesc={'EditGroup: Edit Group'}
      />

      <Scene
        key={'channelEdit'}
        title={'Edit Subgroup'}
        component={EditSubgroup}
        analyticsDesc={'EditSubgroup: Edit Subgroup'}
      />

      <Scene
        key={'resendNotification'}
        title={'View Notification Details'}
        component={ResendNotification}
        analyticsDesc={'resendNotification: resendNotification'}
      />

      <Scene
        key={'myProfile'}
        title={'My Profile'}
        component={MyProfile}
        analyticsDesc={'MyProfile: MyProfile'}
      />

      <Scene
        key={'AddFbPage'}
        title={'Add Facebook Page'}
        component={AddFbPage}
        analyticsDesc={'AddFbPage: AddFbPage'}
      />

      <Scene
        key={'fbpages'}
        title={'Facebook Pages'}
        onRight={() => Actions.AddFbPage()}
        rightTitle="Add"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        component={FBPages}
        analyticsDesc={'FBPages: FBPages'}
      />

       <Scene
        key={'EditFbPage'}
        title={'Edit Facebook Page'}
        component={EditFbPage}
        analyticsDesc={'EditFbPage: EditFbPage'}
      />

       <Scene
        key={'FbCustomers'}
        title={'Facebook Customers'}
        component={FbCustomers}
        analyticsDesc={'FbCustomers: FbCustomers'}
      />

       <Scene
        key={'fbChats'}
        title={'Chat'}
        component={FbChat}
        onRight={() => Actions.FbSettings()}
        rightTitle="Settings"
        rightButtonTextStyle={styles.rightbarbuttonstyle}
        analyticsDesc={'FbChat: FbChat'}
      />

    </Scene>
  </Scene>,
);


