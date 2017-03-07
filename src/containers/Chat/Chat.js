import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  View,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TabViewAnimated, TabBarTop } from 'react-native-tab-view';
import { List, ListItem, SocialIcon, Card, Button, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Loading from '@components/general/Loading';

import auth from '../../services/auth';

import * as chatActions from '@redux/chat/chatActions';
import * as TeamActions from '@redux/team/teamActions';
import * as AgentActions from '@redux/agents/agentActions';


// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

// Components
import { Alerts, Spacer, Text } from '@components/ui/';


class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
    this.onSend = this.onSend.bind(this);
    this.renderChat = this.renderChat.bind(this);
    this.renderChat(this.props.chat);
  }

   componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps is called with chat session data');
  }


  renderChat = (whatever) => {
      // var temp = [];
     this.props.chat.map((item, index) => {

      this.state.messages.push(
           {
          _id: index,
          text: item.msg,
          createdAt: item.datetime,
          user: {
            _id: index + '2',
            name:  item.from,
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }
        );

    }, this);

    // this.setState({messages: temp});
  }

  onSend(messages = []) {
    this.sendToServer(messages[0]);

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  sendToServer = async (input) => {
    console.log("Send to Server Called");
    var token =  await auth.getToken();
    var today = new Date();
    var uid = Math.random().toString(36).substring(7);
    var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
    var body = {
      to: this.props.sessioninfo.customerID,//customerID
      from: this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname,//agent name
      visitoremail: this.props.sessioninfo.customerid.email,// customer email
      socketid:"",
      status:"sent", // ‘sent’,’delivered’,’seen’
      type:"message",
      uniqueid: unique_id, //unique identifier
      msg: input.text, //message
      datetime: Date.now(),//date time
      time: "",
      request_id: this.props.sessioninfo.request_id, //Session’s request id
      messagechannel: this.props.sessioninfo.messagechannel[0], //channel id of session
      companyid: this.props.sessioninfo.companyid,
      is_seen:"no", //yes/no
      customerid:this.props.sessioninfo.customerid,  //7 keys, Obj of customer id inside Session obj
      groupmembers:this.props.sessioninfo.agent_ids, //empty if session is ‘new’
      sendersEmail: this.props.userdetails.email, //Agent’s email
      fromMobile:"yes" // yes/no
      };

      // console.log(body);
      
      // console.log(this.props.sessioninfo);
      if(token != ''){
        console.log("Calling send Chat");  
        this.props.sendChat(token, body);
      }
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}
      />
    );
  }
}



const mapDispatchToProps = {
  sessionsFetch: chatActions.sessionsFetch,
  chatsFetch: chatActions.chatsFetch,
  teamFetch: TeamActions.teamFetch,
  agentTeamFetch : TeamActions.agentTeamFetch,
  sendChat: chatActions.sendChat,
  
};
function mapStateToProps(state) {
   const { singleChat } = state.chat;
  const { userdetails } = state.user;
  return { singleChat, userdetails };

}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
