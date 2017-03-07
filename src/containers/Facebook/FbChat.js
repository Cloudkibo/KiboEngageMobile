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
import * as FbActions from '@redux/facebook/FbActions';


// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

// Components
import { Alerts, Spacer, Text } from '@components/ui/';

var handleDate = function(d){

var c = new Date(Number(d));
return c;

}
class FbChat extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
    // this.state = 
    this.onSend = this.onSend.bind(this);
    this.renderChat = this.renderChat.bind(this);
   // this.renderChat(this.props.fbchatSelected);
  }

  componentDidMount(){
    console.log('component did. mount called');
    if(this.props.fbchatSelected){
      this.renderChat(this.props);
      this.forceUpdate(); 
    }
  }


  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called with chat session data');
    // console.log(nextProps.teams);
    if(nextProps.fbchatSelected){
      this.renderChat(nextProps);
    //  this.forceUpdate(); 
     }
  }

   

  renderChat = (nextProps) => {
      // var temp = [];
     // this.setState({messages:[]});

       /* message: temp[i].message.text,
        inbound: true,
        backColor: '#3d83fa',
        textColor: "white",
        avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
        duration: 0,
        timestamp:temp[i].timestamp,
        senderid:temp[i].senderid,
        recipientid:temp[i].recipientid,
        mid:temp[i].message.mid,
        attachments:temp[i].message.attachments,
        seen:false
*/
     var temparray = [];
      for(var i=0;i<nextProps.fbchatSelected.length;i++){

       if(nextProps.fbchatSelected[i].message){
            var item = nextProps.fbchatSelected[i];
            if(item.message.text){
               temparray.push(
                     {
                    _id: i,
                    text: item.message.text,
                    createdAt: handleDate(item.timestamp),
                    timestamp:item.timestamp,
                    senderid:item.senderid,
                    recipientid:item.recipientid,
                    mid:item.message.mid,
                    attachments:item.message.attachments,
                    seen:false,
                    user: {
                      _id: item.senderid,
                     // name:  item.senderid,
                      name: 'React Native',
                      avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
                    },
                   
                  }
                 );
             }
              else if(item.message.attachments && item.message.attachments.length >0 && item.message.attachments[0].type == "image"){
                 console.log(item.message.attachments);
                 temparray.push(
                    {
                    _id: i,
                    text: '',
                    createdAt: handleDate(item.timestamp),
                    timestamp:item.timestamp,
                    senderid:item.senderid,
                    recipientid:item.recipientid,
                    mid:item.message.mid,
                    attachments:item.message.attachments,
                    seen:false,
                    user: {
                      _id: item.senderid,
                     // name:  item.senderid,
                      name: 'React Native',
                      avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
                    },
                    image:item.message.attachments[0].payload.url,
                    //image: 'https://scontent.xx.fbcdn.net/v/t34.0-12/16933685_1261326827270353_187253959_n.png',
                   
                  }
                 );
                  
            }
           
  
              }
            }
    
              this.setState({messages:temparray});
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
 // fetchfbcustomers: FbActions.fetchfbcustomers,
 // getfbChats:FbActions.getfbChats,
 // updatedSelectedFbChats:FbActions.updatedSelectedFbChats,
  
};
function mapStateToProps(state) {
   const { fbcustomers,fbchats,fbchatSelected} = state.fbpages;
  
  return { fbcustomers,fbchats,fbchatSelected};

}
export default connect(mapStateToProps, mapDispatchToProps)(FbChat);

