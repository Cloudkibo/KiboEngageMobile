/**
 * Launch Screen
 *  - Shows a nice loading screen whilst:
 *  - Checking if user is logged in, and redirects from there
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';
import auth from '../../services/auth';
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  launchImage: {
    width: AppSizes.screen.width,
    height: AppSizes.screen.height,
  },
});

/* Component ==================================================================== */
class AppLaunch extends Component {
  static componentName = 'AppLaunch';

  static propTypes = {
    login: PropTypes.func.isRequired,
  }

  componentDidMount =  async() => {
    /*
    // Try to authenticate based on existing token
    this.props.login()
      // Logged in, show index screen
      .then(() => Actions.app({ type: 'reset' }))
      // Not Logged in, show Login screen
      .catch(() => Actions.authenticate({ type: 'reset' }));*/


      var token = await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token == '' || token == null){
         Actions.authenticate({ type: 'reset' })
      }
     else{
         console.log('redirecting to app');
        Actions.app({ type: 'reset' })
      }
  }

  render = () => (
    <View style={[AppStyles.container]}>
      <Image
        source={require('@images/launch.jpg')}
        style={[styles.launchImage, AppStyles.containerCentered]}
      >
        <ActivityIndicator
          animating
          size={'large'}
          color={'#C1C5C8'}
        />
      </Image>
    </View>
  );
}

/* Export Component ==================================================================== */
export default AppLaunch;
