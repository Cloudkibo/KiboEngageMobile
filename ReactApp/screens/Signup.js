import React, { Component } from 'react';
import { ScrollView, StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar, } from 'react-native';
import { connect } from 'react-redux';
import { signupuser,registerUpdate } from '../actions';
import { Card, CardSection, Input, Spinner ,Button} from './common';
//import {Button,Icon,View,Text} from '@shoutem/ui'
//import SplashScreen from 'react-native-smart-splash-screen'

class Signup extends Component {
  
  static componentName = 'Sign up';

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    close: React.PropTypes.func.isRequired,
  }

  onButtonPress() {
               if (this.props.password != this.props.cpassword) {
                  //alert('Password donot match!.Retype password');
                  console.log('Password donot match!.Retype password');
                  this.props.password = this.props.cpassword = ''
                }
                if (this.props.fname && this.props.lname && this.props.password && this.props.cpassword && this.props.email && this.props.phone && this.props.cname && this.props.domain) {
                  var user = {
                    'firstname': this.props.fname,
                    'lastname': this.props.lname,
                    'email': this.props.email,
                    'phone': this.props.phone,
                    'password': this.props.password,
                    'companyName': this.props.cname,
                    'website': this.props.domain
                  }
                  console.log(user);

                  this.props.signupuser(user)
                 // fnameRef.value = lnameRef.value = pwdRef.value = c_pwdRef.value = emailRef.value = phoneRef.value = cname.value = cdnameRef.value = '';
                }
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
           <Button styleName="full-width muted" onPress={this.onButtonPress.bind(this)}>
               Register
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
            value={this.props.fname}
            onChangeText={value => this.props.registerUpdate({ prop: 'fname', value })}          
          />
        </CardSection>

        <CardSection>
           <Input
            label="Last Name"
            placeholder="Last Name"
            value={this.props.lname}
            onChangeText={value => this.props.registerUpdate({ prop: 'lname', value })} 
          />
        </CardSection>

        <CardSection>
           <Input
            label="Email"
            placeholder="email@gmail.com"
            value={this.props.email}
            onChangeText={value => this.props.registerUpdate({ prop: 'email', value })} 
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label="Password"
            placeholder="password"
            value={this.props.password}
            onChangeText={value => this.props.registerUpdate({ prop: 'password', value })} 
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label="Confirm Password"
            placeholder="Retype password"
           
            value={this.props.cpassword}
            onChangeText={value => this.props.registerUpdate({ prop: 'cpassword', value })} 
         />
        </CardSection>

        <CardSection>
           <Input
            label="Phone"
            placeholder="22-5567"
            value={this.props.phone}
            onChangeText={value => this.props.registerUpdate({ prop: 'phone', value })} 
          
          />
        </CardSection>
        <CardSection>
           <Input
            label="Company Name"
            placeholder="company name"
            value={this.props.cname}
            onChangeText={value => this.props.registerUpdate({ prop: 'cname', value })} 
           />
        </CardSection>
        <CardSection>
           <Input
            label="Domain"
            placeholder="company domain"
            value={this.props.domain}
            onChangeText={value => this.props.registerUpdate({ prop: 'domain', value })} 
           />
        </CardSection>
        {
          this.props.errorSignup && this.props.errorSignup.map(function (err, i) {
                    return(
                       <Text style={styles.errorTextStyle}>
                          {err}
                       </Text>
       
                    )
                  })
        }
       

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

function mapStateToProps(state) {
   const { fname,lname,email,phone,password,cpassword,cname,domain, errorSignup } = state.auth;

  return {fname,lname,email,phone,password,cpassword,cname,domain, errorSignup };

}

export default connect(mapStateToProps, { signupuser ,registerUpdate})(Signup);

