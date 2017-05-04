/**
 * Coming Soon
 *
    <InviteAgent text={"Hello World"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { PropTypes, Component } from 'react';
import { View } from 'react-native';
import axios from 'axios';
// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Text, Card, Spacer, Alerts, } from '@ui/';
import { TextInput, Button, Picker, ScrollView } from 'react-native';
var ReactNative = require('react-native');
import auth from '../../services/auth';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as AgentActions from '@redux/agents/agentActions';
import * as TeamActions from '@redux/team/TeamActions';
import * as GroupActions from '@redux/group/groupActions';
import * as SubgroupActions from '@redux/subgroup/SubgroupActions';
import * as chatActions from '@redux/chat/chatActions';
import * as FbActions from '@redux/facebook/FbActions';
var querystring = require('querystring');
/* Component ==================================================================== */
styles = {
  cardDescription: {
    fontStyle: 'normal',
    fontSize: 10
  }
}




class FbSettings extends Component {

  constructor(props) {
    super(props);
    var ReactNative = require('react-native');
    this.state = {items: [], language: '', teamsList: [], channelList: [], assignedAgent: '', assignedTeam: '', assignedChannel: '', platform: 'Detected Platform: ' + ReactNative.Platform.OS};
    this.createPickerItems = this.createPickerItems.bind(this);
    console.log("Current Session",  this.props.currentSession);
}
  componentWillMount = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
        this.props.agentFetch(token); //No need to call this endpoint here again, I have added it in ChatSession [Zarmeen]
       this.props.teamFetch(token);
       // this.props.channelFetch(token);
      //  this.props.agentTeamFetch(token);
       }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    // console.log(nextProps);
    if(nextProps.agents && nextProps.teams){
       this.createPickerItems(nextProps);
     }
  }

  createPickerItems(nextProps){
     console.log('called');
    itemsTemp = [];
    teamsListTemp = [];
    nextProps.agents.map((item, index) => {
       return itemsTemp.push(
           <Picker.Item label={item.firstname + ' ' + item.lastname} key={'key-'+item._id } value={item._id+','+item.email} />
       );
     });
      nextProps.teams.map((item, index) => {
       return teamsListTemp.push(
           <Picker.Item label={item.groupname} key={'key-'+item._id } value={item._id} />
       );
     });
     itemsTemp.unshift(<Picker.Item label='Select an agent' value={'123'+','+'test'} />);
     teamsListTemp.unshift(<Picker.Item label='Select an team' value={'123'+','+'test'} />);
     console.log("Teams in fb settings", nextProps.teams);
     console.log("Agents in fb settings", nextProps.agents);
     this.setState({items: itemsTemp});
     this.setState({teamsList: teamsListTemp});
  }

  assignToAgents = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
        //preparing data
        console.log("Emails", this.state.assignedAgent);
        id_emails = this.state.assignedAgent.split(",");
        data = {
        companyid : this.props.currentSession.pageid.companyid,
        pageid : this.props.currentSession.pageid._id, //_id field of page object
        user_id: this.props.currentSession.user_id._id, //_id field of user object //Ask if this is small or capital?
        agentAssignment : {
            assignedto : this.props.currentSession.user_id._id,
            assignedby : this.props.userdetails._id,
            companyid : this.props.currentSession.pageid.companyid,
            datetime : Date.now(),
            type : 'agent',
            pageid : this.props.currentSession.pageid._id, //fb page id, this is the ‘_id’ field of pageid object inside fbsession object
            userid: this.props.currentSession.user_id._id, //fb user id, this is the ‘_id’ field of user_id object inside fbsession object
        },
          type : 'agent',
          agentemail : [id_emails[1]]
        }
        console.log("Assign agent data stanza", data);
        this.props.assignChatSession(token, data);
       }
  }


  assignToGroups = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
         //update session status on server
        var session = {
          request_id : this.props.singleChat.request_id,
          status : 'assigned',
        }
        
        //preparing data
         var emails = []; 
         this.props.teams.map((item, index) => {
          var agents = this.props.teamagents.filter((g)=> g.groupid == item._id);
          console.log("Filtered Objects");
          console.log(this.props.agents);
          for(i = 0; i < agents.length; i++){
            for(j = 0; j < this.props.agents.length; j++){
              if(this.props.agents[j]._id == agents[i].agentid){
                // console.log(this.props.agents[j].email);
                emails.push(this.props.agents[j].email);
              }
            }
          }
         });
         console.log("Emails");
         var unique = emails.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
          console.log("Unique emails", unique);
        
        data = {
        companyid : this.props.currentSession.pageid.companyid,
        pageid : this.props.currentSession.pageid._id, //_id field of page object
        user_id: this.props.currentSession.user_id._id, //_id field of user object //Ask if this is small or capital?
        agentAssignment : {
            assignedto : this.state.assignedTeam,
            assignedby : this.props.userdetails._id,
            companyid : this.props.currentSession.pageid.companyid,
            datetime : Date.now(),
            type : 'group',
            pageid : this.props.currentSession.pageid._id, //fb page id, this is the ‘_id’ field of pageid object inside fbsession object
            userid: this.props.currentSession.user_id._id, //fb user id, this is the ‘_id’ field of user_id object inside fbsession object
        },
          type : 'group',
          agentemail : unique
        }
        console.log("Assign team data stanza", data);
        this.props.assignChatSession(token, data);
        
        // input = {
        //   agentidTo: this.state.assignedTeam,
        //   agentidBy: this.props.userdetails._id,
        //   companyid: this.props.singleChat.companyid,
        //   requestid: this.props.singleChat.request_id,
        //   _id: this.props.singleChat._id,
        //   type: 'group',
        //   email: unique,
        // };

        // this.props.moveAgent(token, input,session);
       }
  }

  assignToChannels = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
        //preparing data
        input = {
          channel_to: this.state.assignedChannel,
          channel_from: this.props.singleChat.departmentid,
          agentidBy: this.props.userdetails._id,
          companyid: this.props.singleChat.companyid,
          requestid: this.props.singleChat.request_id,
          _id: this.props.singleChat._id,
        };
        console.log("Calling move subgroup");
        this.props.moveChannel(token, input);
        // console.log("Channel Move called");
       }
  }

  markChatResolved = async () => {
    var token =  await auth.getToken();
    if(token != ''){
      data = {
        companyid : this.props.currentSession.pageid.companyid,
        pageid: this.props.currentSession.pageid._id, //_id field
        user_id:this.props.currentSession.user_id._id, //_id field

      };
      this.props.resolveChatSessions(token, data);
    }
  }

  render() {

    console.log("Agents in fb settings render", this.props.agents);
    return (

    <ScrollView>
      <View style={[AppStyles.container]}>
    <Spacer size={50} />
    
    <Card>
    <Text>{this.state.platform}</Text>
         <Alerts
            status={ this.props.agent_assign_status }
            success=''
            error=''
      />
      <Text>Status</Text>
      <Text style={styles.cardDescription}>
        Current Status - {this.props.singleChat.status}
      </Text>
      <Text style={styles.cardDescription}>
        {this.props.singleChat.team_name} - {this.props.singleChat.channel_name}
      </Text>
      
    </Card>
    <Card>
    <Text>Assign To Agent {this.state.assignedAgent}</Text>
    <Spacer size={10} />
       <Picker
        selectedValue={this.state.assignedAgent}
        onValueChange={(toAgentId) => this.setState({assignedAgent: toAgentId})}
        >
  {this.state.items}
</Picker>
     <Spacer size={10} />
     <Button
        title="Assign"
        color="#841584"
        accessibilityLabel="Assign To Agent"
        onPress={this.assignToAgents}
      />
    </Card>

     <Card>
    <Text>Assign To Team {this.state.assignedTeam}</Text>
    <Spacer size={10} />
      <Picker
          selectedValue={this.state.assignedTeam}
        onValueChange={(toGroupId) => this.setState({assignedTeam: toGroupId})}>
  {this.state.teamsList}
</Picker>
     <Spacer size={10} />
     <Button
        title="Assign"
        color="#841584"
        accessibilityLabel="Assign To Team"
        onPress={this.assignToGroups}
      />
    </Card>

    <Spacer size={20} />
     <Button
        title="Mark Resolved"
        color="#841584"
        accessibilityLabel="Mark As Resolved"
        onPress={this.markChatResolved}
      />

  </View>
  </ScrollView>
    );
  }
}


/* Export Component ==================================================================== */
const mapDispatchToProps = {
  agentFetch: AgentActions.agentFetch,
  teamFetch: TeamActions.teamFetch,
  resolveChatSessions: FbActions.resolveChatSessions,
  moveAgent: chatActions.assignAgent,
  moveChannel: SubgroupActions.assignChannel,
  agentTeamFetch : TeamActions.agentTeamFetch,
  assignChatSession: FbActions.assignChatSession,
};
function mapStateToProps(state) {
   const { agents } = state.agents;
   const { teams, teamagents } = state.teams;
   const { subgroups} = state.subgroups;
   const { userdetails } = state.user;
   const { singleChat,invite_agent_status } = state.chat;
   const { currentSession, agent_assign_status } = state.fbpages;
   return { agents, teams, subgroups, userdetails, singleChat, invite_agent_status, teamagents, currentSession, agent_assign_status };
}
export default connect(mapStateToProps, mapDispatchToProps)(FbSettings);

