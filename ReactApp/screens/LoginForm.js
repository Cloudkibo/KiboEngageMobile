import React, { Component } from 'react';
//import { Text } from 'react-native';
//import { Actions } from 'react-native-router-flux';
import auth from '../services/auth';

import { connect } from 'react-redux';
import { emailChanged,domainChanged, passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Spinner,Button} from './common';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native'

import Signup from './Signup'

class LoginForm extends Component {
  static componentName = 'Login';

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    close: React.PropTypes.func.isRequired,
  }


  componentDidMount () {
   // SplashScreen.close(SplashScreen.animationType.scale, 1000, 500)
    if(auth.loggedIn() == true){
      console.log('auth.loggedIn() return true');
 //     Actions.main()
    }
  }
   componentWillUnmount() {
    // Fix https://github.com/aksonov/react-native-router-flux/issues/172
   // Actions.currentRouter = null
  }
  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onDomainChange(text) {
    this.props.domainChanged(text);
  }
  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onButtonPress() {
    const { email, password,domain } = this.props;

    this.props.loginUser({ email, password,domain });
  }
  onSignupPress(){
   // Actions.signup();
//    this.props.close();

    this.props.navigator.push({
      title: 'Sign up',
      component: Signup, 
      index: 2,
    });
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
      <View styleName="horizontal flexible">
            <Button onPress={this.onButtonPress.bind(this)}>
                  Login
            </Button>
            <Button onPress={this.onSignupPress.bind(this)}>
                  Sign Up
            </Button>
     </View>
      
    );
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label="Company Domain"
            placeholder="Company domain"
            onChangeText={this.onDomainChange.bind(this)}
            value={this.props.domain}
          />
        </CardSection>

        <CardSection>
          <Input
            label="Email"
            placeholder="email@gmail.com"
            onChangeText={this.onEmailChange.bind(this)}
            value={this.props.email}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label="Password"
            placeholder="password"
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.props.password}
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>
          {this.props.error}
        </Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
};

const mapStateToProps = ({ auth }) => {
  const { email, password,domain, error, loading } = auth;

  return { email, password,domain, error, loading };
};

export default connect(mapStateToProps, {
  emailChanged,domainChanged, passwordChanged, loginUser
})(LoginForm);

