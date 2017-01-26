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
  Alert,
  
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
class JoinGroup extends Component {
  static componentName = 'JoinGroup';

  constructor(props) {
    super(props);
    console.log('join group is called');
    console.log(this.props.group);
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

    this.newFellowAgents  = []
    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',

      },
      

      
      form_fields: FormValidation.struct({
        groupName:validName,
        groupDescription: validDesc,
        status:validDesc,
      }),
      empty_form_values: {
        groupName:'',
        groupDescription: '',
      
      },
      form_values: {
        groupName:this.props.group.groupname,
        groupDescription: this.props.group.groupdescription,
        status:this.props.group.status,
      
      },
      options: {
        fields: {
          groupName: {
            error: 'Please enter group name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            editable : false,
          },
          groupDescription: {
            error: 'Please enter short group description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            multiline: true,
            stylesheet: stylesheet,
            editable : false,
          },
          status:{
            nullOption:false,
            editable : false,
          }
          
        },
      },
    };



    

  }

 
  confirmJoin = async() => {
    // Form is valid
       this.setState({ resultMsg: { status: 'Joining group...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }


        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
   
            this.props.joingroup({
              groupid:this.props.group._id,
              agentid : this.props.userdetails._id,
              token:token,
            })
        }
  }

  joinGroup = () => {

    var useringrp = false;
    for(var i =0;i<this.props.groupagents.length;i++){
          if(this.props.groupagents[i].agentid._id == this.props.userdetails._id && this.props.groupagents[i].groupid._id == this.props.group._id){
            useringrp = true;
            console.log('user in group already');
            break;
          }
        }
    if(useringrp == false){
    Alert.alert(
            'Join Group',
            'Are you sure you want to join this group?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed!')},
              {text: 'Yes', onPress: () => this.confirmJoin()},
            ]
          )

    }

    else{
       this.setState({ resultMsg: { status: 'You are already in this group' } });

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
            title={'Join Group'}
            onPress={this.joinGroup}
          />
         

         
        </Card>
       </ScrollView>
    );
  }
}


function mapStateToProps(state) {
   const {groups,grouperror,groupsuccess} =  state.groups;
   const { userdetails } = state.user;
  
  return {groups,grouperror,groupsuccess,userdetails};
}


// Any actions to map to the component?
const mapDispatchToProps = {
  joingroup: GroupActions.joingroup
  
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinGroup);

