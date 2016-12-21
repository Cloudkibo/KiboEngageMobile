import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
//import { emailChanged, passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Button, Spinner } from './common';
import SplashScreen from 'react-native-smart-splash-screen'

class LoginForm extends Component {
  componentDidMount () {
    SplashScreen.close(SplashScreen.animationType.scale, 1000, 500)
  }

  onEmailChange(text) {
  //  this.props.emailChanged(text);
  }

  onDomainChange(text) {
  //  this.props.emailChanged(text);
  }
  onPasswordChange(text) {
  //  this.props.passwordChanged(text);
  }

  onButtonPress() {
    const { email, password } = this.props;

    //this.props.loginUser({ email, password });
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        Login
      </Button>
    );
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label="Company Domain"
            placeholder="Enter company domain"
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

export default LoginForm