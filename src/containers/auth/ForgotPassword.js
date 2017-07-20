/**
 * Login Screen
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  View
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
// Consts and Libs
import * as AuthActions from '@redux/auth/AuthActions';
import { AppStyles } from '@theme/';

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';

/* Component ==================================================================== */
class ForgotPassword extends Component {
  static componentName = 'ForgotPassword';

  

  constructor(props) {
    super(props);

    // Email Validation
    const validEmail = FormValidation.refinement(
      FormValidation.String, (email) => {
        const regularExpression = /^.+@.+\..+$/i;

        return regularExpression.test(email);
      },
    );

    
    const validDomain = FormValidation.refinement(
      FormValidation.String, (domain) => {
        if (domain.length < 1) return false;
        return true;
      },
    );


    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      form_fields: FormValidation.struct({
        Domain:validDomain,
        Email: validEmail,
      
      }),
      empty_form_values: {
        Domain:'',
        Email: '',
     
      },
      form_values: {},
      options: {
        fields: {
          Domain: {
            error: 'Please enter domain',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Email: {
            error: 'Please enter a valid email',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
        
        },
      },
    };
  }

  

  componentWillReceiveProps(nextProps) {
    if(nextProps.forgotpassword_status){
      this.setState({ resultMsg: { status: nextProps.forgotpassword_status } });
    }
  }
  /**
    * Login
    */
  forgotpassword = () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
      this.setState({ form_values: credentials }, () => {
        this.setState({ resultMsg: { status: 'One Moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        this.props.forgotpassword({
          email: credentials.Email.toLowerCase(),
          website:credentials.Domain,
        })
      });
    }
  }
  
  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <View
        automaticallyAdjustContentInsets={false}
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <ScrollView
        ref={(a) => { this.scrollView = a; }}
      >
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.state.resultMsg.success}
            error={this.state.resultMsg.error}
          />

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          <Button
            title={'ForgotPassword'}
            onPress={this.forgotpassword}
          />

          <Spacer size={10} />

         
        </Card>
        </ScrollView>
      </View>
    );
  }
}

/* Export Component ==================================================================== */

function mapStateToProps(state) {
   const {forgotpassword_status} = state.auth;
  return { forgotpassword_status };


}
// Any actions to map to the component?
const mapDispatchToProps = {
  forgotpassword: AuthActions.forgotpassword,
 
};
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

