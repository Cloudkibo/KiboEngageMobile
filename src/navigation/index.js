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
import CreateTeam from '@containers/Teams/CreateTeam';
import EditTeam from '@containers/Teams/EditTeam';

import Placeholder from '@components/general/Placeholder';
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
        key={'teamEdit'}
        title={'Edit Team'}
        component={EditTeam}
        analyticsDesc={'EditTeam: Edit Team'}
      />
    </Scene>
  </Scene>,
);
