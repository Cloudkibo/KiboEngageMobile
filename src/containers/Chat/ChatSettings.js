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
        this.props.agentFetch(token);
        this.props.groupFetch(token);
        this.props.channelFetch(token);
       }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    // console.log(nextProps);
    if(nextProps.agents && nextProps.groups && nextProps.channels && nextProps.singleChat){
       this.createPickerItems(nextProps);
     }
  }

  createPickerItems(nextProps){
    this.state.items = [];
    this.state.groupsList = [];
    this.state.channelList = [];
     nextProps.agents.map((item, index) => {
       return this.state.items.push(
           <Picker.Item label={item.firstname + ' ' + item.lastname} key={'key-'+item._id } value={item._id} />
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
        input = {
          agentidTo: this.state.assignedAgent,
          agentidBy: this.props.userdetails._id,
          companyid: this.props.singleChat.companyid,
          requestid: this.props.singleChat.request_id,
          _id: this.props.singleChat._id,
          type: 'agent'
        };

        this.props.moveAgent(token, input);
       }
  }


  assignToGroups = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
        //preparing data
        input = {
          agentidTo: this.state.assignedGroup,
          agentidBy: this.props.userdetails._id,
          companyid: this.props.singleChat.companyid,
          requestid: this.props.singleChat.requestid,
          _id: this.props.singleChat._id,
          type: 'group'
        };

        this.props.moveAgent(token, input);
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
          requestid: this.props.singleChat.requestid,
          _id: this.props.singleChat._id,
          type: 'group'
        };

        this.props.moveChannel(token, input);
       }
  }

  render() {
    return (

    <ScrollView>
      <View style={[AppStyles.container]}>
    <Spacer size={50} />
    
    <Card>
    <Text>{this.state.platform}</Text>
      <Text>Status</Text>
      <Text style={styles.cardDescription}>
        Current Status - Assigned 
      </Text>
      <Text style={styles.cardDescription}>
        Finance - Payment
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
    <Text>Assign To Group {this.state.assignedGroup}</Text>
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
};
function mapStateToProps(state) {
   const { agents } = state.agents;
   const { groups } = state.groups;
   const { channels} = state.channels;
   const { userdetails } = state.user;
   const { singleChat } = state.chat;
   return { agents, groups, channels, userdetails, singleChat };
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);

