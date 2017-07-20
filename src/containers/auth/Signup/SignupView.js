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
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles } from '@theme/';

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';

/* Component ==================================================================== */
class Signup extends Component {
  static componentName = 'Signup';

  static propTypes = {
    login: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    // Email Validation
    const validEmail = FormValidation.refinement(
      FormValidation.String, (email) => {
        const regularExpression = /^.+@.+\..+$/i;

        return regularExpression.test(email);
      },
    );

    // Password Validation - Must be 6 chars long
    const validPassword = FormValidation.refinement(
      FormValidation.String, (password) => {
        if (password.length < 6) return false;
        return true;
      },
    );

     // Phone Validation - Must be number
    const validPhone= FormValidation.refinement(
      FormValidation.String, (phone) => {
        const regularExpression =  /[0-9]/;
        return regularExpression.test(phone);
      },
    );
    const validDomain = FormValidation.refinement(
      FormValidation.String, (domain) => {
        if (domain.length < 1) return false;
        return true;
      },
    );
    const validString= FormValidation.refinement(
      FormValidation.String, (name) => {
        
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
        Firstname:validString,
        Lastname:validString,
        Phone: validPhone,
        Email: validEmail,
        Password: validPassword,
       
        Companyname:validString,
        Website:validDomain,
        


      }),
      empty_form_values: {
        Firstname:'',
        Lastname:'',
        Email: '',
        Password: '',
        Phone:'',
        Companyname:'',
        Website:'',



      },
      form_values: {},
      options: {
        fields: {
          Firstname: {
            error: 'Please enter a valid name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Lastname: {
            error: 'Please enter a valid name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },

          Phone: {
            error: 'Please enter a valid phone number',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Companyname: {
            error: 'Please enter a valid Company name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          
          Website: {
            error: 'Please enter domain',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },

          Email: {
            error: 'Please enter a valid email',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Password: {
            error: 'Your new password must be more than 6 characters',
            clearButtonMode: 'while-editing',
            secureTextEntry: true,
          },

        },
      },
    };
  }

  componentDidMount = async () => {
    // Get user data from AsyncStorage to populate fields
   /* const values = await AsyncStorage.getItem('api/credentials');
    const jsonValues = JSON.parse(values);

    if (values !== null) {
      this.setState({
        form_values: {
          Domain: jsonValues.domain,
          Email: jsonValues.username,
          Password: jsonValues.password,

        },
      });
    }*/
  }

  /**
    * Signup
    */
  signup = () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
      this.setState({ form_values: credentials }, () => {
        this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        this.props.signup({
          firstname: credentials.Firstname,
          lastname: credentials.Lastname,
          email: credentials.Email,
          phone: credentials.Phone,
          password: credentials.Password,
          companyName: credentials.Companyname,
          website: credentials.Website,
        })/*.then(() => {
          this.setState({
            resultMsg: { success: 'Awesome, you\'re now logged in!' },
          }, () => {
            setTimeout(() => {
              Actions.app({ type: 'reset' });
            }, 1000);
          });
        }).catch((err) => {
         // const error = AppAPI.handleError(err);
          this.setState({ resultMsg: { err } });
        });*/
      });
    }
  }
  
  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <ScrollView
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
            title={'Signup'}
            onPress={this.signup}
          />

          <Spacer size={10} />
        </Card>
      </ScrollView>
    );
  }
}

/* Export Component ==================================================================== */
export default Signup;
