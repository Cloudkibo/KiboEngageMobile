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
import * as TeamActions from '@redux/team/TeamActions';
import { connect } from 'react-redux';
var _ = require('lodash');

// Components
import { Alerts, Card, Spacer, Text, Button } from '@components/ui/';

/* Component ==================================================================== */
class JoinTeam extends Component {
  static componentName = 'JoinTeam';

  constructor(props) {
    super(props);
    console.log('join team is called');
    console.log(this.props.team);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);

    // overriding the text color
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;
    
   
    const validName= FormValidation.refinement(
      FormValidation.String, (teamname) => {
        if (teamname.length < 1) return false;
        return true;
      },
    );

    const validDesc= FormValidation.refinement(
      FormValidation.String, (teamdesc) => {
        if (teamdesc.length < 1) return false;
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
        teamName:validName,
        teamDescription: validDesc,
        status:validDesc,
      }),
      empty_form_values: {
        teamName:'',
        teamDescription: '',
      
      },
      form_values: {
        teamName:this.props.team.groupname,
        teamDescription: this.props.team.groupdescription,
        status:this.props.team.status,
      
      },
      options: {
        fields: {
          teamName: {
            error: 'Please enter team name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            editable : false,
          },
          teamDescription: {
            error: 'Please enter short team description',
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
       this.setState({ resultMsg: { status: 'Joining team...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }


        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
   
            this.props.jointeam({
              teamid:this.props.team._id,
              agentid : this.props.userdetails._id,
              token:token,
            })
        }
  }

  joinTeam = () => {

    var useringrp = false;
    for(var i =0;i<this.props.teamagents.length;i++){
          if(this.props.teamagents[i].agentid._id == this.props.userdetails._id && this.props.teamagents[i].teamid._id == this.props.team._id){
            useringrp = true;
            console.log('user in team already');
            break;
          }
        }
    if(useringrp == false){
    Alert.alert(
            'Join Team',
            'Are you sure you want to join this team?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed!')},
              {text: 'Yes', onPress: () => this.confirmJoin()},
            ]
          )

    }

    else{
       this.setState({ resultMsg: { status: 'You are already in this team' } });

    }
     
  }
  

  render = () => {
    const Form = FormValidation.form.Form;
    console.log("Join teams", this.props.team);
    var text = "Join Team";
    var joined = false;
    for(var i = 0; i < this.props.myteams.length; i++){
      if(this.props.team.companyid==this.props.myteams[i].companyid){
        text = "Already joined";
        joined = true;
      }
    }
    return (
      <ScrollView style={[AppStyles.container]}>
      <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.teamsuccess}
            error={this.props.teamerror}
          />

  
          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

         <Spacer size={20} />
          <Button
            title={text}
            onPress={this.joinTeam}
            disabled={joined}
          />
         

         
        </Card>
       </ScrollView>
    );
  }
}


function mapStateToProps(state) {
   const {myteams, teams,teamerror,teamsuccess} =  state.teams;
   const { userdetails } = state.user;
  
  return {myteams, teams,teamerror,teamsuccess,userdetails};
}


// Any actions to map to the component?
const mapDispatchToProps = {
  jointeam: TeamActions.jointeam
  
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinTeam);

