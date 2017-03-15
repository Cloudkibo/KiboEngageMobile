import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  View,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
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
    this.state = {messages: [], text: 'Useless Placeholder' };
    // this.state = 
    this.onSend = this.onSend.bind(this);
    this.renderChat = this.renderChat.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);
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
      this.forceUpdate(); 
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
                      _id: this.props.senderid == item.senderid?2:1,
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
                      _id: this.props.senderid == item.senderid?2:1,
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
  //   var data = { 
  //     _id:"9be49b8a-d930-4b0b-8962-af54fa0cd86b",
  //     createdAt: Date.now(),
  //     text:this.state.text,
  //     user: {
  //       _id:1
  //     },
  // };
  // messages[0] = data;
    console.log("On Send", messages);
  //  messages[0].text = this.state.text; 
  if(messages[0].text == ''){
    messages[0].image = 'http://1.bp.blogspot.com/-qns_lZPjg0I/VWY2dO1HN-I/AAAAAAAACVA/akLTMY7RJSk/s1600/Thumbs-up-facebook-icon-small.png'; 
  }
   var msgObj = messages[0];
   var today = new Date();  
   var uid = Math.random().toString(36).substring(7);
   var unique_id = 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();

    var pageid=''
    for(var i=0;i<this.props.fbchatSelected.length;i++){
      if(this.props.fbchatSelected[i].senderid == this.props.senderid){
        pageid = this.props.fbchatSelected[i].recipientid;
        //alert(pageid)
        break;
      }
    }
    var saveMsg = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.senderid,
              companyid:this.props.userdetails.uniqueid,
              timestamp:Date.now(),
              message:{
                mid:unique_id,
                seq:1,
                text:msgObj.text,
                // text: this.state.text,
              },

             pageid:pageid
              
    }
    this.setState({text: ''});

    console.log(saveMsg);

    this.props.getfbchatfromAgent(saveMsg);
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  renderComposer(props){
     console.log('renderComposer props',props);
     

    return(
      <View style={{flex: 1, flexDirection: 'row'}}>
        <TextInput placeholderTextColor="rgba(67,88,101,0.4)" 
         value={this.state.text} multiline={true} 
         style={{maxHeight:100,height:Math.max(40,props.composerHeight),color: 'rgb(67,88,101)' ,fontSize: 15, flex: 4, padding:5}}
          onChangeText={(e) => {
            this.setState({text:e});
            console.log("Printing e in onchange", e);
        }}
        />
        </View>
    )
  }

  renderSend(props) {
    var button = 'paper-plane';
    if(this.state.text == ''){
      button = 'thumbs-o-up';
    }
    return (
<Icon
  reverse
  name={button}
  type='font-awesome'
  color='#517fa4'
  size={15} 
  onPress={() => props.onSend({text:this.state.text.trim()}, true)}
/>
    );
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        renderComposer={this.renderComposer}
        onSend={this.onSend}
        renderSend = {this.renderSend}
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
  getfbchatfromAgent:FbActions.getfbchatfromAgent
};
function mapStateToProps(state) {
   const { fbcustomers,fbchats,fbchatSelected} = state.fbpages;
    const { userdetails} = state.user;
  return { fbcustomers,fbchats,fbchatSelected,userdetails};

}
export default connect(mapStateToProps, mapDispatchToProps)(FbChat);

