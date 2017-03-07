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
import * as GroupActions from '@redux/group/GroupActions';
import * as ChannelActions from '@redux/channel/ChannelActions';
import * as chatActions from '@redux/chat/chatActions';
var querystring = require('querystring');
/* Component ==================================================================== */
styles = {
  cardDescription: {
    fontStyle: 'normal',
    fontSize: 10
  }
}




class ChatSettings extends Component {

  constructor(props) {
    super(props);
    var ReactNative = require('react-native');
    this.state = {items: [], language: '', groupsList: [], channelList: [], assignedAgent: '', assignedGroup: '', assignedChannel: '', platform: 'Detected Platform: ' + ReactNative.Platform.OS};
}
  componentWillMount = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
        //this.props.agentFetch(token); //No need to call this endpoint here again, I have added it in ChatSession [Zarmeen]
        this.props.groupFetch(token);
        this.props.channelFetch(token);
        this.props.agentGroupFetch(token);
       }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    // console.log(nextProps);
    if(nextProps.agents && nextProps.groups && nextProps.channels && nextProps.singleChat && nextProps.groupagents){
       this.createPickerItems(nextProps);
     }
  }

  createPickerItems(nextProps){
    this.state.items = [];
    this.state.groupsList = [];
    this.state.channelList = [];
     nextProps.agents.map((item, index) => {
       return this.state.items.push(
           <Picker.Item label={item.firstname + ' ' + item.lastname} key={'key-'+item._id } value={item._id+','+item.email} />
       );
     });
      nextProps.groups.map((item, index) => {
       return this.state.groupsList.push(
           <Picker.Item label={item.groupname} key={'key-'+item._id } value={item._id} />
       );
     });
     nextProps.channels.map((item, index) => {
       return this.state.channelList.push(
           <Picker.Item label={item.msg_channel_name} key={'key-'+item._id } value={item._id} />
       );
     });
  }

  assignToAgents = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
        //preparing data
        id_emails = this.state.assignedAgent.split(",");

        //update session status on server
        var session = {
          request_id : this.props.singleChat.request_id,
          status : 'assigned',
        }
        
        input = {
          agentidTo: id_emails[0],
          agentidBy: this.props.userdetails._id,
          companyid: this.props.singleChat.companyid,
          requestid: this.props.singleChat.request_id,
          _id: this.props.singleChat._id,
          type: 'agent',
          email: [id_emails[1]]
        };

        this.props.moveAgent(token, input,session);
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
         this.props.groups.map((item, index) => {
          var agents = this.props.groupagents.filter((g)=> g.groupid == item._id);
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
          console.log(unique);
        input = {
          agentidTo: this.state.assignedGroup,
          agentidBy: this.props.userdetails._id,
          companyid: this.props.singleChat.companyid,
          requestid: this.props.singleChat.request_id,
          _id: this.props.singleChat._id,
          type: 'group',
          email: unique,
        };

        this.props.moveAgent(token, input,session);
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
        console.log("Calling move channel");
        this.props.moveChannel(token, input);
        // console.log("Channel Move called");
       }
  }

  render() {
    return (

    <ScrollView>
      <View style={[AppStyles.container]}>
    <Spacer size={50} />
    
    <Card>
    <Text>{this.state.platform}</Text>
         <Alerts
            status={ this.props.invite_agent_status }
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
    <Text>Assign To Group</Text>
    <Spacer size={10} />
      <Picker
          selectedValue={this.state.assignedGroup}
        onValueChange={(toGroupId) => this.setState({assignedGroup: toGroupId})}>
  {this.state.groupsList}
</Picker>
     <Spacer size={10} />
     <Button
        title="Assign"
        color="#841584"
        accessibilityLabel="Assign To Group"
        onPress={this.assignToGroups}
      />
    </Card>

     <Card>
    <Text>Move To Other Channel {this.state.assignedChannel}</Text>
    <Spacer size={10} />
      <Picker
   selectedValue={this.state.assignedChannel}
        onValueChange={(toChannelId) => this.setState({assignedChannel: toChannelId})}>
  {this.state.channelList}
</Picker>
     <Spacer size={10} />
     <Button
        title="Move"
        color="#841584"
        accessibilityLabel="Move To Other Channel"
        onPress={this.assignToChannels}
      />
    </Card>

  </View>
  </ScrollView>
    );
  }
}


/* Export Component ==================================================================== */
const mapDispatchToProps = {
  agentFetch: AgentActions.agentFetch,
  groupFetch: GroupActions.groupFetch,
  channelFetch: ChannelActions.channelFetch,
  moveAgent: chatActions.assignAgent,
  moveChannel: ChannelActions.assignChannel,
  agentGroupFetch : GroupActions.agentGroupFetch,
};
function mapStateToProps(state) {
   const { agents } = state.agents;
   const { groups, groupagents } = state.groups;
   const { channels} = state.channels;
   const { userdetails } = state.user;
   const { singleChat,invite_agent_status } = state.chat;
   return { agents, groups, channels, userdetails, singleChat, invite_agent_status, groupagents };
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);

