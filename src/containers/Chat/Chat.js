import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import * as GChat  from 'react-native-gifted-chat';
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
import PercentageCircle from 'react-native-percentage-circle';
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
    this.renderBubble = this.renderBubble.bind(this);
    this.renderChat(this.props.chat);
  }

   componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps is called with chat session data');
  }


  renderChat = (whatever) => {
      // var temp = [];
      console.log("Single Chat", this.props.singleChat);
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
  // console.log(msgObj);
   var today = new Date();  
   var uid = Math.random().toString(36).substring(7);
   var unique_id = 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();

   

    if(msgObj.file){
      /*** for image file ******/
      console.log('msgObj.file is true');
      console.log(msgObj.file);
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
                  _id:unique_id,
              };

              console.log(fileobj);
              //  var body = {
              //     to: this.props.sessioninfo.customerID,//customerID
              //     from: this.props.userdetails.firstname,//agent name
              //     visitoremail: this.props.sessioninfo.customerid.email,// customer email
              //     socketid:"",
              //     status:"sent", // ‘sent’,’delivered’,’seen’
              //     type:"message",
              //     uniqueid: unique_id, //unique identifier
              //     msg: 'New file sent', //message
              //     datetime: Date.now(),//date time
              //     time: "",
              //     request_id: this.props.sessioninfo.request_id, //Session’s request id
              //     messagechannel: this.props.sessioninfo.messagechannel[0], //subgroup id of session
              //     companyid: this.props.sessioninfo.companyid,
              //     is_seen:"no", //yes/no
              //     customerid:this.props.sessioninfo.customerid,  //7 keys, Obj of customer id inside Session obj
              //     groupmembers:this.props.sessioninfo.agent_ids, //empty if session is ‘new’
              //     sendersEmail: this.props.userdetails.email, //Agent’s email
              //     fromMobile:"yes" // yes/no
              //     };
                  messages[0] = {
                    createdAt: Date.now(),
                    text: filename,
                    user: {
                      _id: 1,
                    },
                    type: 'file',
                    _id:unique_id,
                  };
                  console.log("Updated messages", messages);
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
                   this.props.uploadChatDocfile(fileobj, {});
    }
  }else{
     this.sendToServer(messages[0]);
     console.log("Messages changed:", messages);
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
}
    
  }


  selectFileTapped() {
    console.log('selectFileTapped called');
    
    if(ReactNative.Platform.OS == "android"){

      const FilePickerManager = require('NativeModules').FilePickerManager;

      FilePickerManager.showFilePicker(null, (response) => {
  console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled file picker');
  }
  else if (response.error) {
    console.log('FilePickerManager Error: ', response.error);
  }
  else {
      // console.log("Success", response);
           var files = [];
           var fileName = response.path.split("/");
           fileName = fileName[fileName.length - 1];
         files.push({
              file: {
                filename:fileName,
                uri:response.path.split("/").slice(0,-1).join("/")
            }});
             console.log(files);
         this.onSend(files);
  }
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
              file: url.uri,
            })
          setTimeout( () => {
                console.log('setTimeout called');
                if(url!= ''){
                     this.onSend(files);
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

    renderBubble(prop) {
    console.log("IN render bubble", prop.currentMessage);
    var isFile = false;
    var fileUpload = {};
    if(this.props.upload){
    for(var i=0; i < this.props.upload.length; i++){
      if(prop.currentMessage._id == this.props.upload[i].message_id){
          console.log(this.props.upload[i]);
          isFile = true;
          fileUpload = this.props.upload[i];
      }
    }
  }
    
    if(isFile  && fileUpload.progress < 100 && fileUpload.progress >= 0){

      return (
            <View>

              <PercentageCircle radius={35} percent={fileUpload.progress} color={"#3498db"}>
                <Text>{fileUpload.progress}%</Text>
              </PercentageCircle>  
            </View>
      );
    }else if(fileUpload.progress == -1){
      prop.currentMessage.text = 'Failed to upload' + prop.currentMessage.text;
      return (
      <GChat.Bubble
        {...prop}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
    } 
    else{
    return (
      <GChat.Bubble
        {...prop}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
    }
    // this.props.downloadFile(); 
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
        renderBubble={this.renderBubble}
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
   const { singleChat,invite_agent_status, upload } = state.chat;
   return { agents, teams, subgroups, userdetails, singleChat, invite_agent_status, teamagents, upload };
 



}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
