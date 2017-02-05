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
      FormValidation.String, (teamname) => {
        if (teamname.length < 1) return false;
        return true;
      },
    );

    const validNumber= FormValidation.refinement(
      FormValidation.Number, (teamname) => {
        if (teamname.length < 1) return false;
        return true;
      },
    );

    var yn = FormValidation.enums({
              yes: 'Yes',
              no: 'No'
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
        smsPhoneNumber: validNumber,
        companyDomainEmails: yn,
        notifyByEmail: yn,
        smsNotification: yn,
        showSummary: yn,
        allowChat: yn,
        openWidgetAsSeparate: widget,
        emailTemplate1 : validString,
        emailTemplate2 : validString,
      }),
      empty_form_values: {
      
      },
      form_values: {
          allowChat:'yes',
          companyDomainEmails: 'yes',
          notifyByEmail: 'yes',
          notificationemailaddress: 'Les passants',
          smsNotification: 'yes',
          showSummary: 'yes',
          openWidgetAsSeparate: 'window',
      },
      options: {
        fields: {
          
        emailTemplate1: {
          label: 'Email Template 1 (Reschedule Resolved Session)',
          autoCapitalize: 'none',
          clearButtonMode: 'while-editing',
          multiline: true,
          // placeholder: 'We had conversation on the (insert date). We wanted have more conversation with you. \nWe have scheduled your meeting.',
          stylesheet: stylesheet // overriding the style of the textbox
        },
        emailTemplate2: {
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
        allowChat:{
            nullOption:false,
          },
        openWidgetAsSeparate:{
            nullOption:false,
          },

        companyDomainEmails:{
            nullOption:false,
          },
        notifyByEmail:{
          nullOption:false,
        },
        smsNotification:{
            nullOption:false,
        },
        showSummary:{
            nullOption:false,
          },
        
      },
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
        newVals = {
          maxNumberOfTeams: '',
          maxNumberOfChannelsPerTeam: nextProps.maxnumberofchannels,
          notificationemailaddress: nextProps.notificationemailaddress,
          smsPhoneNumber: nextProps.smsphonenumber,
          companyDomainEmails: nextProps.isdomainemail,
          notifyByEmail: nextProps.allowemailnotification,
          smsNotification: nextProps.allowsmsnotification,
          showSummary: nextProps.showsummary,
          allowChat: nextProps.allowChat,
          openWidgetAsSeparate: nextProps.widgetwindowtab,
          emailTemplate1 : nextProps.abandonedscheduleemail1,
          emailTemplate2 : nextProps.abandonedscheduleemail2,
      };
      this.setState({ form_values: newVals });
      this.setState({ test: 'New Props Received' });
  }

 



  render = () => {
      
      const Form = FormValidation.form.Form;
      
     return (

          <ScrollView style={[AppStyles.container]}>
          <Spacer size={55} />

          <Card>
            <Text>{ this.state.test }</Text>
             <Text>Company Settings</Text>
              <Form
                  ref={(b) => { this.form = b; }}
                  type={this.state.form_fields}
                  value={this.state.form_values}
                  options={this.state.options}
                />
             <Button
            title={'Save'}
              />
              </Card>
            </ScrollView>
           
 
  );
}
}


const mapDispatchToProps = {
  settingsFetch: companyActions.settingsFetch,
};
function mapStateToProps(state) {
   var { data } = state.company;
   data = data[0];
  return { ...data };

}
export default connect(mapStateToProps, mapDispatchToProps)(CompanySettings);

