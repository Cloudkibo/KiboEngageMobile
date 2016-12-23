import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
//import { emailChanged,domainChanged, passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Spinner } from './common';
import {Button,Icon,View,Text} from '@shoutem/ui'
//import SplashScreen from 'react-native-smart-splash-screen'

class Signup extends Component {
  componentDidMount () {
 //   SplashScreen.close(SplashScreen.animationType.scale, 1000, 500)
  }

  onEmailChange(text) {
  //  this.props.emailChanged(text);
  }

  onDomainChange(text) {
 //   this.props.domainChanged(text);
  }
  onPasswordChange(text) {
   // this.props.passwordChanged(text);
  }

  onButtonPress() {
    //const { email, password,domain } = this.props;

   // this.props.loginUser({ email, password,domain });
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
           <Button styleName="full-width muted" onPress={this.onButtonPress.bind(this)}>
              <Icon name="ic_user_profile" />
              <Text>Register</Text>
            </Button>
         
    );
  }

  render() {
    return (
      <ScrollView style={styles.containerStyle}>
        <CardSection>
          <Input
            label="First Name"
            placeholder="First Name"
          
          />
        </CardSection>

        <CardSection>
           <Input
            label="Last Name"
            placeholder="Last Name"
          
          />
        </CardSection>

        <CardSection>
           <Input
            label="Email"
            placeholder="email@gmail.com"
          
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

        <CardSection>
          <Input
            secureTextEntry
            label="Confirm Password"
            placeholder="Retype password"
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.props.password}
          />
        </CardSection>

        <CardSection>
           <Input
            label="Phone"
            placeholder="22-5567"
          
          />
        </CardSection>
        <CardSection>
           <Input
            label="Company Name"
            placeholder="company name"
          
          />
        </CardSection>
        <CardSection>
           <Input
            label="Domain"
            placeholder="company domain"
          
          />
        </CardSection>
        <Text style={styles.errorTextStyle}>
          {this.props.error}
        </Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>
      </ScrollView>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },

  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  }

};

/*const mapStateToProps = ({ auth }) => {
  const { email, password,domain, error, loading } = auth;

  return { email, password,domain, error, loading };
};

export default connect(mapStateToProps, {
  emailChanged,domainChanged, passwordChanged, loginUser
})(Signup);
*/

export default Signup
