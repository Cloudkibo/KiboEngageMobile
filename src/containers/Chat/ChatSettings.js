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
import auth from '../../services/auth';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as AgentActions from '@redux/agents/agentActions';
import * as GroupActions from '@redux/group/GroupActions';
import * as ChannelActions from '@redux/channel/ChannelActions';
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
    this.state = {items: [], language: '', groupsList: [], channelList: []};
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
    if(nextProps.agents){
       this.createPickerItems(nextProps);
     }
  }

  createPickerItems(nextProps){
     nextProps.agents.map((item, index) => {
       return this.state.items.push(
           <Picker.Item label={item.firstname + ' ' + item.lastname} value={item._id} />
       );
     });
      nextProps.groups.map((item, index) => {
       return this.state.groupsList.push(
           <Picker.Item label={item.groupname} value={item._id} />
       );
     });
     nextProps.channels.map((item, index) => {
       return this.state.channelList.push(
           <Picker.Item label={item.msg_channel_name} value={item._id} />
       );
     });
  }

  render() {
    return (

    <ScrollView>
      <View style={[AppStyles.container]}>
    <Spacer size={50} />
    
    <Card>
      <Text>Status</Text>
      <Text style={styles.cardDescription}>
        Current Status - Assigned 
      </Text>
      <Text style={styles.cardDescription}>
        Finance - Payment
      </Text>
      
    </Card>
    <Card>
    <Text>Assign To Agent</Text>
    <Spacer size={10} />
       <Picker
  onValueChange={(lang) => this.setState({language: lang})}>
  {this.state.items}
</Picker>
     <Spacer size={10} />
     <Button
        title="Assign"
        color="#841584"
        accessibilityLabel="Send Invite to Agent"
        onPress={this.sendInvite}
      />
    </Card>

     <Card>
    <Text>Assign To Group</Text>
    <Spacer size={10} />
      <Picker
  selectedValue={this.state.language}
  onValueChange={(lang) => this.setState({language: lang})}>
  {this.state.groupsList}
</Picker>
     <Spacer size={10} />
     <Button
        title="Assign"
        color="#841584"
        accessibilityLabel="Send Invite to Agent"
        onPress={this.sendInvite}
      />
    </Card>

     <Card>
    <Text>Move To Other Channel</Text>
    <Spacer size={10} />
      <Picker
  selectedValue={this.state.language}
  onValueChange={(lang) => this.setState({language: lang})}>
  {this.state.channelList}
</Picker>
     <Spacer size={10} />
     <Button
        title="Move"
        color="#841584"
        accessibilityLabel="Send Invite to Agent"
        onPress={this.sendInvite}
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
};
function mapStateToProps(state) {
   const { agents } = state.agents;
   const { groups } = state.groups;
   const { channels} = state.channels;
  return { agents, groups, channels };

}
export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);

