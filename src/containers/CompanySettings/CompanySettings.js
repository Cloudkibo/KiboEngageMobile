/**
 * Style Guide
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import {
  View,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
var _ = require('lodash');
import FormValidation from 'tcomb-form-native';
import { TabViewAnimated, TabBarTop } from 'react-native-tab-view';
import { List, ListItem, SocialIcon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import * as companyActions from '@redux/companysettings/companyActions';
import auth from '../../services/auth';

// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

// Components
import { Alerts, Button, Card, Spacer, Text } from '@components/ui/';

// Example Data
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: AppColors.brand.primary,
  },
  tabbarIndicator: {
    backgroundColor: '#FFF',
  },
  tabbar_text: {
    color: '#FFF',
  },
    button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  container: {
    padding: 15,
  }
});

/* Component ==================================================================== */
class CompanySettings extends Component {
  static componentName = 'CompanySettings';

 constructor(props) {
    super(props);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);

    // overriding the text color
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;
    const validString= FormValidation.refinement(
      FormValidation.String, (groupname) => {
        if (groupname.length < 1) return false;
        return true;
      },
    );

    const validNumber= FormValidation.refinement(
      FormValidation.Number, (groupname) => {
        return true;
      },
    );

    var yn = FormValidation.enums({
              Yes: 'Yes',
              No: 'No'
            });
    var widget = FormValidation.enums({
              window: 'Window',
              tab: 'Tab'
            });

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      form_fields: FormValidation.struct({
        maxNumberOfTeams: validNumber,
        maxNumberOfChannelsPerTeam: validNumber,
        notificationemailaddress: validString,
        smsPhoneNumber: FormValidation.Number,
        companyDomainEmails: yn,
        notifyByEmail: yn,
        smsNotification: yn,
        showSummary: yn,
        allowChat: yn,
        enableFacebook : yn,
        openWidgetAsSeparate: widget,
        emailTemplate1 : validString,
        emailTemplate2 : validString,
        
      }),
      empty_form_values: {
      
      },
      options:{
        fields:{
        emailTemplate1 :{
          label: 'Email Template 1 (Reschedule Resolved Session)',
          autoCapitalize: 'none',
          clearButtonMode: 'while-editing',
          multiline: true,
          // placeholder: 'We had conversation on the (insert date). We wanted have more conversation with you. \nWe have scheduled your meeting.',
          stylesheet: stylesheet // overriding the style of the textbox
        },
        emailTemplate2 :{
          label: 'Email Template 1 (Reschedule Abandoned Session)',
          autoCapitalize: 'none',
          clearButtonMode: 'while-editing',
          multiline: true,
          // placeholder: 'Your placeholder here',
          stylesheet: stylesheet // overriding the style of the textbox

        },
        notificationemailaddress:{
          label: 'Notfication email address'
        },
        }
      }

     }

  this.state.test = "The Illogical Man";

}

   componentWillMount = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
        this.props.settingsFetch(token);
       }
      
    
  
  }


  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps.data);
    if(nextProps.data){
   
        newVals = {
          maxNumberOfTeams: nextProps.data.maxnumberofdepartment,
          maxNumberOfChannelsPerTeam: nextProps.data.maxnumberofsubgroups,
          notificationemailaddress: nextProps.data.notificationemailaddress,
          smsPhoneNumber: nextProps.data.smsphonenumber,
          companyDomainEmails: nextProps.data.isdomainemail,
          notifyByEmail: nextProps.data.allowemailnotification,
          smsNotification: nextProps.data.allowsmsnotification,
          showSummary: nextProps.data.showsummary,
          allowChat: nextProps.data.allowChat,
          openWidgetAsSeparate: nextProps.data.widgetwindowtab,
          emailTemplate1 : nextProps.data.abandonedscheduleemail1,
          emailTemplate2 : nextProps.data.abandonedscheduleemail2,
          enableFacebook: nextProps.data.enableFacebook,
      };


      
      this.setState({ form_values: newVals });
      
      this.setState({ updatedData: nextProps.data });
      this.setState({ test: 'New Props Received' });
       console.log(this.state);
     
  }
}

  saveSettings = async () => {
    var token =  await auth.getToken();
    //console.log(this.state.text);
    console.log(token);
    this.props.save(token, this.state.updatedData);
  }

  valChanged = () => {
    const credentials = this.form.getValue();
    if(credentials){
    this.setState({ form_values: credentials });
    console.log(credentials);
    }
     this.state.updatedData.maxnumberofdepartment = credentials.maxNumberOfTeams;
     this.state.updatedData.maxnumberofsubgroups = credentials.maxNumberOfChannelsPerTeam;
     this.state.updatedData.notificationemailaddress = credentials.notificationemailaddress;
     this.state.updatedData.smsphonenumber = credentials.smsPhoneNumber;
     this.state.updatedData.isdomainemail = credentials.companyDomainEmails;
     this.state.updatedData.allowemailnotification = credentials.notifyByEmail;
     this.state.updatedData.allowsmsnotification = credentials.smsNotification;
     this.state.updatedData.showsummary = credentials.showSummary;
     this.state.updatedData.allowChat = credentials.allowChat;
     this.state.updatedData.widgetwindowtab = credentials.openWidgetAsSeparate;
     this.state.updatedData.abandonedscheduleemail1 = credentials.emailTemplate1;
     this.state.updatedData.abandonedscheduleemail2 = credentials.emailTemplate2;
     this.state.updatedData.enableFacebook = credentials.enableFacebook;
    this.setState({ updatedData: this.state.updatedData });
    this.setState({ test: this.state.updatedData.allowChat });
    this.saveSettings();
  
  }
 



  render = () => {
      
      const Form = FormValidation.form.Form;
      
     return (

          <ScrollView style={[AppStyles.container]}>
          <Spacer size={55} />

          <Card>
          <Alerts
            status={ this.props.updateSettings }
            success=''
            error=''
          />
            <Text>{ this.state.test }</Text>
             <Text>Company Settings</Text>
              <Form
                  ref={(b) => { this.form = b; }}
                  type={this.state.form_fields}
                  value={this.state.form_values}
                  options={this.state.options}
                  
                />
          {this.props.userdetails.isAdmin=="Yes" &&
         
        
            <Button
            title={'Save'}
            onPress = {this.valChanged}
              />
            }
              </Card>
            </ScrollView>
           
 
  );
}
}


const mapDispatchToProps = {
  settingsFetch: companyActions.settingsFetch,
  save: companyActions.settingsSave,
};
function mapStateToProps(state) {
   var { data, updateSettings } = state.company;
   const { userdetails } = state.user;
   data = data[0];
  return { data, updateSettings,userdetails };

}
export default connect(mapStateToProps, mapDispatchToProps)(CompanySettings);

