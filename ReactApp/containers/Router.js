import React from 'react';
import { connect } from 'react-redux';

import { Scene, Router, Actions,Switch } from 'react-native-router-flux';
//import LoginForm from '../components/LoginForm';
import LoginForm from '../components/LoginForm';
import Signup from '../components/Signup';
import Dashboard from '../components/Dashboard';
import TeamList from '../components/TeamList';
import CreateTeam from '../components/CreateTeam';
import auth from '../services/auth';
import Drawer from 'react-native-drawer';
import NavDrawer from '../components/common/NavDrawer';
const RouterComponent = () => {
  return (
  
    <Router sceneStyle={{ paddingTop: 65 }}>
      <Scene key="auth">
        <Scene key="login" component={LoginForm} title="Login" />
        <Scene key="signup" component={Signup} title="Signup" />
      </Scene>

     <Scene key="main">
          <Scene key="dashboard" component={Dashboard} title="Dashboard" initial />
          <Scene key="teams" component={TeamList} title="Teams"  rightTitle="Add" onRight={() => Actions.teamCreate()}/>
          <Scene key="teamCreate" component={CreateTeam} title="Create Team" />
       
     
     </Scene>
    </Router>
  );
};

export default RouterComponent;
