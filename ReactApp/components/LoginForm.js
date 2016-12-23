import React, { Component } from 'react';
//import { Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { emailChanged,domainChanged, passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Spinner } from './common';
import {Button,Icon,View,Text} from '@shoutem/ui'
import SplashScreen from 'react-native-smart-splash-screen'

class LoginForm extends Component {
  componentDidMount () {
    SplashScreen.close(SplashScreen.animationType.scale, 1000, 500)
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
    Actions.signup();
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
      <View styleName="horizontal flexible">
            <Button styleName="full-width muted" onPress={this.onButtonPress.bind(this)}>
              <Icon name="ic_user_profile" />
              <Text>Login</Text>
            </Button>
            <Button styleName="full-width muted" onPress={this.onSignupPress.bind(this)}>
              <Icon name="ic_user_profile" />
              <Text>Sign Up</Text>
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

