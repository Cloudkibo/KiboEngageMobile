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
  View,
  Alert,
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
class EditCannedResponse extends Component {
  static componentName = 'EditCannedResponse';

 
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
      form_values: { 
        shortCode:this.props.cannedresponse.shortcode.slice(1,this.props.cannedresponse.shortcode.length),
        message: this.props.cannedresponse.message},
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
    * Edit Canned Response
    */
  editCannedResponse = async () => {
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
            this.props.editcanned({
              shortcode: '/'+ credentials.shortCode,
              message: credentials.message,
              companyid:this.props.userdetails.uniqueid,
              _id : this.props.cannedresponse._id,
              token:token,
            })
          }
            
        }
      });
    }
  }
  

  deleteCannedConfirm= async () => {
    // Form is valid
        this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
   
            this.props.deletecanned({
              id:this.props.cannedresponse._id,
              token:token,
            })
        }
     
  }

  deleteCanned = () => {

    Alert.alert(
            'Delete Canned Response',
            'Are you sure you want to delete this canned response?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed!')},
              {text: 'Yes', onPress: () => this.deleteCannedConfirm()},
            ]
          )

    
     
  }
  


  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <View
        
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.cannedsuccess}
            error={this.props.cannederror}
          />


          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          <Button
            title={'Save Changes'}
            onPress={this.editCannedResponse}
          />
          <Spacer size={10} />


           <Button
            title={'Delete Response'}
            onPress={this.deleteCanned}
          />

          <Spacer size={10} />

         
        </Card>
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
  editcanned: CannedActions.editcanned,
  deletecanned: CannedActions.deletecanned,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCannedResponse);
