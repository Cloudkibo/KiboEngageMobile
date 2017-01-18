/**
 * App Navigation
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import { Actions, Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';

// Components
import Drawer from '@containers/ui/DrawerContainer';

// Scenes
import AppLaunch from '@containers/Launch/LaunchContainer';
import Teams from '@containers/Teams/Teams';
import Agents from '@containers/Agents/Agents';

import CreateTeam from '@containers/Teams/CreateTeam';
import EditTeam from '@containers/Teams/EditTeam';
import Cannedresponse from '@containers/CannedResponses/Cannedresponse';
import CreateCannedresponse from '@containers/CannedResponses/CreateCannedResponse';
import EditCannedresponse from '@containers/CannedResponses/EditCannedResponse';

import CreateChannel from '@containers/MessageChannels/CreateChannel';
import Channels from '@containers/MessageChannels/Channels';

import Notifications from '@containers/Notifications/Notifications';
import AddNotification from '@containers/Notifications/AddNotification';

import Placeholder from '@components/general/Placeholder';
import Dashboard from '@containers/dashboard';
import AuthScenes from './auth';
import TabsScenes from './tabs';

/* Routes ==================================================================== */
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
        key={'teamCreate'}
        title={'Create Team'}
        component={CreateTeam}
        analyticsDesc={'CreateTeam: Create Team'}
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
        key={'channelCreate'}
        title={'Create Channel'}
        component={CreateChannel}
        analyticsDesc={'CreateChannel: Create Channel'}
      />
      <Scene
        key={'channels'}
        title={'Channels'}
        onRight={() => Actions.channelCreate()}
        rightTitle="Add"
        component={Channels}
        analyticsDesc={'Channels: Channels'}
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
        analyticsDesc={'Cannedresponse: Cannedresponse'}
      />

      <Scene
        key={'agents'}
        title={'Agents'}

        component={Agents}
        analyticsDesc={'Agents:Agents'}
      />

      <Scene
        key={'teamEdit'}
        title={'Edit Team'}
        component={EditTeam}
        analyticsDesc={'EditTeam: Edit Team'}
      />
    </Scene>
  </Scene>,
);