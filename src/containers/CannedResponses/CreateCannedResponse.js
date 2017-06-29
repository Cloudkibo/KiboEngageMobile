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
import auth from '../../services/auth';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles } from '@theme/';
import * as CannedActions from '@redux/cannedresponse/CannedActions';
import { connect } from 'react-redux';

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';

/* Component ==================================================================== */
class CreateCannedResponse extends Component {
  static componentName = 'CreateCannedResponse';

 
  constructor(props) {
    super(props);

    const validName= FormValidation.refinement(
      FormValidation.String, (shortcode) => {
        if (shortcode.length < 1) return false;
        return true;
      },
    );

    const validDesc= FormValidation.refinement(
      FormValidation.String, (message) => {
        if (message.length < 1) return false;
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
        shortCode:validName,
        message: validDesc,
      }),
      empty_form_values: {
        shortCode:'',
        message: '',
      
      },
      form_values: {},
      options: {
        fields: {
          shortCode: {
            error: 'Please enter short code',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          message: {
            error: 'Please enter short message',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          
        },
      },
    };
  }

  componentDidMount = async () => {
    // Get user data from AsyncStorage to populate fields
  /*  const values = await AsyncStorage.getItem('api/credentials');
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
    * Create Team
    */
  createCannedResponse = async () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
      this.setState({ form_values: credentials }, async () => {
        this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
            console.log('company id of user is');
            console.log(this.props.userdetails.uniqueid);
            if(credentials.shortCode && credentials.message && this.props.userdetails.uniqueid){
            this.props.createcanned({
              shortcode: '/'+ credentials.shortCode,
              message: credentials.message,
              companyid:this.props.userdetails.uniqueid,
              token:token,
            });
            this.props.cannedFetch(token);
          }
            
        }
      });
    }
  }
  
  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <View
        
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
      <ScrollView style={[AppStyles.container]}>
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
            title={'Create Canned Response'}
            onPress={this.createCannedResponse}
          />

          <Spacer size={10} />

           <Alerts
           
            success={this.props.cannedsuccess}
            error={this.props.cannederror}
          />
        </Card>
        </ScrollView>
      </View>
    );
  }
}


function mapStateToProps(state) {
   const {cannederror,cannedsuccess} =  state.cannedresponses;
   const { userdetails} = state.user;
  return {cannederror,cannedsuccess,userdetails};
}


// Any actions to map to the component?
const mapDispatchToProps = {
  createcanned: CannedActions.createcanned,
  cannedFetch: CannedActions.cannedFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCannedResponse);
