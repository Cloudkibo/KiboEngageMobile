import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
//import LoginForm from '../components/LoginForm';
import LoginForm from '../components/LoginForm';
import Signup from '../components/Signup';
import Dashboard from '../components/Dashboard';
import auth from '../services/auth';

var rootSelector = 'main'
const RouterComponent = () => {
  rootSelector = auth.loggedIn() ? 'main' : 'auth';
  console.log(rootSelector);
  return (

    <Router sceneStyle={{ paddingTop: 65 }}>
    <Scene key="root"  selector={rootSelector}>
      <Scene key="auth">
        <Scene key="login" component={LoginForm} title="Login" />
        <Scene key="signup" component={Signup} title="Signup" />
      </Scene>


	   <Scene key="main">
        <Scene key="dashboard" component={Dashboard} title="Dashboard" initial/>
    </Scene> 
    </Scene>     
    </Router>
  );
};

export default RouterComponent;
