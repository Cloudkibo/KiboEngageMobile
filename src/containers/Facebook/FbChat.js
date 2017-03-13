import React, { Component } from 'react';
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

import auth from '../../services/auth';
import * as FbActions from '@redux/facebook/FbActions';


// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

// Components
import { Alerts, Spacer, Text } from '@components/ui/';
import CustomActions from './CustomActions';
import CustomView from './CustomView';

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
    this.renderBubble = this.renderBubble.bind(this);
    
    this.renderAccessory = this.renderAccessory.bind(this);
    
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

  async onSend(messages = [],filesize =0 ) {

   var msgObj = messages[0];
   console.log('msgObj');
   console.log(msgObj);
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

    /*** for text message *****/
    if(msgObj.text){
              var saveMsg = {
                        senderid: this.props.userdetails._id,
                        recipientid:this.props.senderid,
                        companyid:this.props.userdetails.uniqueid,
                        timestamp:Date.now(),
                        message:{
                          mid:unique_id,
                          seq:1,
                          text:msgObj.text,
                        },

                       pageid:pageid
                        
              }


              console.log(saveMsg);

              this.props.getfbchatfromAgent(saveMsg);
            }


    /*** for image file ******/
    var filename = msgObj.image.split('/');
    console.log(filename[filename.length-1]);
    
    if(msgObj.image){
      if (auth.loggedIn() === true) {
          console.log('auth.loggedIn() return true');
          const token = await auth.getToken();
            var photo = {
                  uri: msgObj.image,
                  type: 'image',
                  name: filename[filename.length-1],
              };


               var saveMsg = {
                                  senderid: this.props.userdetails._id,
                                  recipientid:this.props.senderid,
                                  companyid:this.props.userdetails.uniqueid,
                                  timestamp:Date.now(),
                                  message:{
                                    mid:unique_id,
                                    seq:1,
                                    attachments:[{
                                      type:'image',
                                      payload:{
                                        url:'',
                                      }

                                    }]
                                  },

                                 pageid:pageid
                  
                            }
           
                   var fileData = new FormData();
                  fileData.append('file', photo);
                  fileData.append('filename',  photo.name);
                  fileData.append('filetype',  photo.type);
                  fileData.append('filesize',  filesize);
                  fileData.append('chatmsg', JSON.stringify(saveMsg));
                  this.props.uploadFbChatfile(fileData,token);

    }
  }

    this.setState((previousState) => {
      return {
        messages: GChat.GiftedChat.append(previousState.messages, messages),
      };
    });
  }


  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <GChat.Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <GChat.Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }
  renderAccessory(props) {
    return (
      <CustomActions
          {...props}
        />
    );
  }
   


  render() {
    return (
      <GChat.GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}

        renderBubble={this.renderBubble}
        renderAccessory={this.renderAccessory}
        renderFooter={this.renderFooter}
      />
    );
  }
}

const mapDispatchToProps = {
 // fetchfbcustomers: FbActions.fetchfbcustomers,
 // getfbChats:FbActions.getfbChats,
 // updatedSelectedFbChats:FbActions.updatedSelectedFbChats,
  getfbchatfromAgent:FbActions.getfbchatfromAgent,

  uploadFbChatfile:FbActions.uploadFbChatfile
};
function mapStateToProps(state) {
   const { fbcustomers,fbchats,fbchatSelected} = state.fbpages;
    const { userdetails} = state.user;
  return { fbcustomers,fbchats,fbchatSelected,userdetails};

}
export default connect(mapStateToProps, mapDispatchToProps)(FbChat);

