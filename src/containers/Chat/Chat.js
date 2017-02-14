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


class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
    // this.state = 
    this.onSend = this.onSend.bind(this);
    this.renderChat = this.renderChat.bind(this);
  }

   componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called with chat session data');
    console.log(nextProps.singleChat);
    this.setState({unique_index: 0});
    if(nextProps.singleChat){
      this.setState({loading:false});
       this.renderChat(nextProps.singleChat);
     }
  }
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    });
  }

  renderChat = (singleChat) => {
      var temp = [];
     singleChat.map((item, index) => {

      temp.push(
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

    this.setState({messages: temp});
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
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
  
};
function mapStateToProps(state) {
   const { singleChat } = state.chat;

  return { singleChat };

}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
