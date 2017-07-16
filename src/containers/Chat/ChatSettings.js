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
import * as GroupActions from '@redux/group/groupActions';
import * as SubgroupActions from '@redux/subgroup/SubgroupActions';
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
    this.state = {
      items: [],
      status: '',
      language: '',
      teamsList: [],
      channelList: [],
      assignedAgent: '',
      assignedChannel: '',
      platform: 'Detected Platform: ' + ReactNative.Platform.OS,
    };
    this.createPickerItems = this.createPickerItems.bind(this);
}
  componentWillMount = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
        //this.props.agentFetch(token); //No need to call this endpoint here again, I have added it in ChatSession [Zarmeen]
       // this.props.teamFetch(token);
       // this.props.channelFetch(token);
       // this.props.agentTeamFetch(token);
       }
  }

  componentDidMount() {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    // console.log(nextProps);
    if(this.props.agents && this.props.teams && this.props.subgroups && this.props.singleChat && this.props.teamagents){
       this.createPickerItems();
     }
  }

  createPickerItems(){
     console.log('called');
    this.state.items = [];
    this.state.teamsList = [];
    this.state.channelList = [];
    this.state.items.push(
           <Picker.Item label="Select an agent" key={'key-'+-1 } value={-1} />
       );
          this.state.teamsList.push(
           <Picker.Item label="Select a team" key={'key-'+-1 } value={-1} />
       );
          this.state.channelList.push(
           <Picker.Item label="Select an subgroup" key={'key-'+-1 } value={-1} />
       );
    this.props.agents.map((item, index) => {
       return this.state.items.push(
           <Picker.Item label={item.firstname + ' ' + item.lastname} key={'key-'+item._id } value={item._id+','+item.email} />
       );
     });

      this.props.teams.map((item, index) => {
       return this.state.teamsList.push(
           <Picker.Item label={item.groupname} key={'key-'+item._id } value={item._id} />
       );
     });
     this.props.subgroups.filter((c)=>c.groupid == this.props.singleChat.departmentid).map((item, index) => {
       return this.state.channelList.push(
           <Picker.Item label={item.msg_channel_name} key={'key-'+item._id } value={item._id} />
       );
     });

     console.log(this.state.teamsList);
     this.forceUpdate();
  }

  assignToAgents = async () => {
    //this.props.agentFetch();
    this.setState({
      status: 'One moment ...',
    });
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      // Scroll to top, to show message
      console.log(this.scrollView);
    if (this.scrollView) {
      console.log('scrolltotop');
      this.scrollView.scrollTo({ y: 0 });
    }

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
        console.log(this.props.data);
        this.props.moveAgent(token, input,session,this.props.data,'assigned');
        this.props.agentFetch(token);
      }
  }

  assignToChannels = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){

        // Scroll to top, to show message
      if (this.scrollView) {
        this.scrollView.scrollTo({ y: 0 });
      }


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

      // Scroll to top, to show message
    if (this.scrollView) {
      this.scrollView.scrollTo({ y: 0 });
    }

      this.props.markResolve(token, this.props.singleChat.request_id);
    }
  }

  render() {
    return (

    <ScrollView
      ref={(b) => { this.scrollView = b; }}
    >
      <View style={[AppStyles.container]}>
    <Spacer size={50} />

    <Card>
         <Alerts
            status={ this.props.invite_agent_status ? this.props.invite_agent_status : this.state.status }
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
    <Text>Assign To Agent</Text>
    <Spacer size={10} />
       <Picker
        selectedValue={this.state.assignedAgent}
        onValueChange={(toAgentId) => this.setState({assignedAgent: toAgentId})}
        >
  {this.state.items}
</Picker>

     <Button
        title="Assign"
        color="#841584"
        accessibilityLabel="Assign To Agent"
        onPress={this.assignToAgents}
      />
    </Card>

     <Card>
    <Text>Move To Other Channel</Text>
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
  //teamFetch: TeamActions.teamFetch,
  channelFetch: SubgroupActions.channelFetch,
  moveAgent: chatActions.assignAgent,
  markResolve: chatActions.resolveChatSession,
  moveChannel: SubgroupActions.assignChannel,
 // agentTeamFetch : TeamActions.agentTeamFetch,
};
function mapStateToProps(state) {
   const { agents } = state.agents;
   const { teams, teamagents } = state.teams;
   const { subgroups} = state.subgroups;
   const { userdetails } = state.user;
   const { singleChat,invite_agent_status,data } = state.chat;
   return { agents, teams, subgroups, userdetails, singleChat, invite_agent_status, teamagents, data };
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);
