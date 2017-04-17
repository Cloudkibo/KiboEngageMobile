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
import * as GroupActions from '@redux/group/groupActions';
import * as AgentActions from '@redux/agents/agentActions';
const DocumentPicker = require('react-native').NativeModules.RNDocumentPicker;
var ReactNative = require('react-native');

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
    this.renderActions = this.renderActions.bind(this);
    this.selectFileTapped = this.selectFileTapped.bind(this);
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

  async onSend(messages = []) {

    var msgObj = messages[0];
   console.log('msgObj');
   console.log(msgObj);
   var today = new Date();  
   var uid = Math.random().toString(36).substring(7);
   var unique_id = 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();

   

    if(msgObj.file){
      /*** for image file ******/
      console.log('msgObj.file is true');
      var filename;
      var fileext;
      if(msgObj.file.filename){
         filename = msgObj.file.filename;
         fileext = filename.split('.').pop();

      }
      else{
         const split = msgObj.file.split('/');
         filename = split.pop();
         fileext = filename.split('.').pop();
        // filename = filename[filename.length-1]
      }
      console.log('fileext');
      console.log(fileext);
      console.log(filename);
      if (auth.loggedIn() === true) {
          console.log('auth.loggedIn() return true');
          const token = await auth.getToken();
            var fileobj = {
                  uri: msgObj.file.uri?msgObj.file.uri+'/'+msgObj.file.filename:msgObj.file,
                  type: 'application/'+fileext,
                  name: filename,
              };

              console.log(fileobj);
               var body = {
                  to: this.props.sessioninfo.customerID,//customerID
                  from: this.props.userdetails.firstname,//agent name
                  visitoremail: this.props.sessioninfo.customerid.email,// customer email
                  socketid:"",
                  status:"sent", // ‘sent’,’delivered’,’seen’
                  type:"message",
                  uniqueid: unique_id, //unique identifier
                  msg: 'New file sent', //message
                  datetime: Date.now(),//date time
                  time: "",
                  request_id: this.props.sessioninfo.request_id, //Session’s request id
                  messagechannel: this.props.sessioninfo.messagechannel[0], //subgroup id of session
                  companyid: this.props.sessioninfo.companyid,
                  is_seen:"no", //yes/no
                  customerid:this.props.sessioninfo.customerid,  //7 keys, Obj of customer id inside Session obj
                  groupmembers:this.props.sessioninfo.agent_ids, //empty if session is ‘new’
                  sendersEmail: this.props.userdetails.email, //Agent’s email
                  fromMobile:"yes" // yes/no
                  };
                  messages[0] = {
                    createdAt: Date.now(),
                    text: filename + '.' + fileext,
                    user: {
                      _id: 1,
                    },

                    _id:unique_id,
                  };
                  console.log("Updated messages", messages);
                  // this.props.uploadChatDocfile(fileobj, body);
    }
  }else{
     this.sendToServer(messages[0]);
  }
    console.log("Messages changed:", messages);
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }


  selectFileTapped() {
    console.log('selectFileTapped called');
    
    if(ReactNative.Platform.OS == "android"){
       DocumentPicker.show({
      filetype:['*/*']
    },(error,url) => {
     // Alert(url);
      console.log(url);

       var files = [];
         files.push({
              file: {
                filename:url.fileName,
                uri:url.uri
            }})

          setTimeout( () => {
                console.log('setTimeout called');
                if(url!= ''){
                     this.onSend(files);
              }
        },5000);
    }); 
    }
    else if(ReactNative.Platform.OS == "ios")
    DocumentPicker.show({
         filetype: ['public.image','com.adobe.pdf','com.microsoft.word.doc','com.microsoft.excel.xls','com.microsoft.powerpoint.​ppt'],
    },(error,url) => {
     // Alert(url);
      console.log(url);
       var files = [];
         files.push({
              file: url,
            })
          setTimeout( () => {
                console.log('setTimeout called');
                if(url!= ''){
                     this.props.onSend(files);
              }
        },5000);
         
       
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
      from: this.props.userdetails.firstname,//agent name
      visitoremail: this.props.sessioninfo.customerid.email,// customer email
      socketid:"",
      status:"sent", // ‘sent’,’delivered’,’seen’
      type:"message",
      uniqueid: unique_id, //unique identifier
      msg: input.text, //message
      datetime: Date.now(),//date time
      time: "",
      request_id: this.props.sessioninfo.request_id, //Session’s request id
      messagechannel: this.props.sessioninfo.messagechannel[0], //subgroup id of session
      companyid: this.props.sessioninfo.companyid,
      is_seen:"no", //yes/no
      customerid:this.props.sessioninfo.customerid,  //7 keys, Obj of customer id inside Session obj
      groupmembers:this.props.sessioninfo.agent_ids, //empty if session is ‘new’
      sendersEmail: this.props.userdetails.email, //Agent’s email
      fromMobile:"yes" // yes/no
      };

      console.log(body);
      
      // console.log(this.props.sessioninfo);
      if(token != ''){
        console.log("Calling send Chat");
        console.log("Print token " + token);  
        this.props.sendChat(token, body);
      }
  }


  renderActions(prop){
    return (
        <TouchableOpacity onPress={this.selectFileTapped}
        style={{padding: 5}}>
         <Icon
          name='paperclip'
          type='font-awesome'
          color='#444d56;'
          size={26}
        />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        renderActions={this.renderActions}
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
  groupFetch: GroupActions.groupFetch,
  agentGroupFetch : GroupActions.agentGroupFetch,
  sendChat: chatActions.sendChat,
  uploadChatDocfile: chatActions.uploadChatDocfile,
  
};
function mapStateToProps(state) {
   const { userdetails } = state.user;
   const { agents } = state.agents;
   const { teams, teamagents } = state.teams;
   const { subgroups} = state.subgroups;
   const { singleChat,invite_agent_status } = state.chat;
   return { agents, teams, subgroups, userdetails, singleChat, invite_agent_status, teamagents };
 



}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
