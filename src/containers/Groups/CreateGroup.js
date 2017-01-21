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
  ListView,
  
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import auth from '../../services/auth';
import { List, ListItem, SocialIcon } from 'react-native-elements';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppSizes} from '@theme/';
import * as GroupActions from '@redux/group/GroupActions';
import { connect } from 'react-redux';
var _ = require('lodash');

// Components
import { Alerts, Card, Spacer, Text, Button } from '@components/ui/';

/* Component ==================================================================== */
class CreateGroup extends Component {
  static componentName = 'CreateGroup';

  constructor(props) {
    super(props);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);

    // overriding the text color
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;

   
    const validName= FormValidation.refinement(
      FormValidation.String, (groupname) => {
        if (groupname.length < 1) return false;
        return true;
      },
    );

    const validDesc= FormValidation.refinement(
      FormValidation.String, (groupdesc) => {
        if (groupdesc.length < 1) return false;
        return true;
      },
    );

    var Status = FormValidation.enums({
              public: 'Public',
              private: 'Private'
            });

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',

      },
      
      
      form_fields: FormValidation.struct({
        groupName:validName,
        groupDescription: validDesc,
        status:Status,
      }),
      empty_form_values: {
        groupName:'',
        groupDescription: '',
      
      },
      form_values: {
        status:'public',
        
      },
      options: {
       fields: {
          groupName: {
            error: 'Please enter group name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          groupDescription: {
            error: 'Please enter short group description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            multiline: true,
            stylesheet: stylesheet 
          },
          status:{
            nullOption:false,
          }
          
        },
      },
    };



    

  }

  

  /**
    * Create Group
    */
  createGroup = async () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
      this.setState({ form_values: credentials }, async () => {
        this.setState({ resultMsg: { status: 'Creating group...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
    
            console.log(credentials.status);
           this.props.creategroup({
                          groupname: credentials.groupName,
                          groupdescription: credentials.groupDescription,
                          status : credentials.status,
                          token:token,
            });
        }
      });
    }
  }
  
  
  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <ScrollView style={[AppStyles.container]}>
      <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.groupsuccess}
            error={this.props.grouperror}
          />

  
          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />


           <Spacer size={20} />
          
          <Button
            title={'Create Group'}
            onPress={this.createGroup}
          />
       
         
        </Card>
       </ScrollView>
    );
  }
}


function mapStateToProps(state) {
   const {groups,grouperror,groupsuccess} =  state.groups;
  
  return {groups,grouperror,groupsuccess};
}


// Any actions to map to the component?
const mapDispatchToProps = {
  creategroup: GroupActions.creategroup,
 
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);

