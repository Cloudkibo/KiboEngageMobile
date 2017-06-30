import React, { Component } from 'react';
import * as GChat  from 'react-native-gifted-chat';
import {
  View,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  WebView,
  Image,
  Slider,
} from 'react-native';
import { TabViewAnimated, TabBarTop } from 'react-native-tab-view';
import { List, ListItem, SocialIcon, Card, Button, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Loading from '@components/general/Loading';
//import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import auth from '../../services/auth';
import * as FbActions from '@redux/facebook/FbActions';
import ReactTimeout from 'react-timeout/native';
import EmojiPicker from 'react-native-emojipicker/lib/Picker';
var ReactNative = require('react-native');
// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

// Components
import { Alerts, Spacer, Text } from '@components/ui/';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import AudioPlayer from './AudioPlayer';

import GoogleStaticMap from 'react-native-google-static-map';


var handleDate = function(d){

var c = new Date(Number(d));
return c;

}
class FbChat extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: [], text: '', gifItems:[], stickerItems:[], chatProp: {}, stickgif: false,

    };
    this.onSend = this.onSend.bind(this);
    this.renderChat = this.renderChat.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderAccessory = this.renderAccessory.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.logEmoji = this.logEmoji.bind(this);
    this.renderFooter  = this.renderFooter.bind(this);
    this.sendStickerGif = this.sendStickerGif.bind(this);

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
    // console.log(nextProps.groups);
    if(nextProps.fbchatSelected){
      this.renderChat(nextProps);
      this.forceUpdate();
      this.renderGif(nextProps);
      this.renderSticker(nextProps);
     }
     if(nextProps.upload){
       console.log("Upload updated");
       this.renderChat(nextProps);
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
     console.log("In render chat", nextProps.fbchatSelected);
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
                    //  name:  item.senderid,
                      name: 'React Native',
                      avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
                    },
                    image:item.message.attachments[0].payload.url,
                    //image: 'https://scontent.xx.fbcdn.net/v/t34.0-12/16933685_1261326827270353_187253959_n.png',

                  }
                 );

            }else if(item.message.attachments && item.message.attachments.length >0 && item.message.attachments[0].type == "file"){
                 console.log(item.message.attachments);
                 var url = item.message.attachments[0].payload.url;
                 temparray.push(
                    {
                    _id: i,
                    text: url.split('/')[url.split('/').length-1].split('?')[0],
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

                    // image:'https://cdn3.iconfinder.com/data/icons/web-icons-1/64/Cloud_Download-512.png',
                  }
                 );

            }else if(item.message.attachments && item.message.attachments.length >0 && item.message.attachments[0].type == "video"){
                 console.log(item.message.attachments);
                 var url = item.message.attachments[0].payload.url;
                 temparray.push(
                    {
                    _id: i,
                    text: "Some stupid video",
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

                    // image:'https://cdn3.iconfinder.com/data/icons/web-icons-1/64/Cloud_Download-512.png',
                  }
                 );

            }else if(item.message.attachments && item.message.attachments.length >0 && item.message.attachments[0].type == "audio"){
                 console.log(item.message.attachments);
                 var url = item.message.attachments[0].payload.url;
                 temparray.push(
                    {
                    _id: i,
                    text: "Audio File",
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

                    // image:'https://cdn3.iconfinder.com/data/icons/web-icons-1/64/Cloud_Download-512.png',
                  }
                 );

            }else if(item.message.attachments && item.message.attachments.length >0 && item.message.attachments[0].type == "location"){
                 console.log(item.message.attachments);
                 var url = item.message.attachments[0].payload.url;
                 temparray.push(
                    {
                    _id: i,
                    text: item.message.attachments[0].payload.title,
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

                    // image:'https://cdn3.iconfinder.com/data/icons/web-icons-1/64/Cloud_Download-512.png',
                  }
                 );

            }


              }
            }

              this.setState({messages:temparray});
    }

  async onSend(messages = [],filesize =0 ) {
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
    messages[0].image = 'https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m&oh=d79f2abf6978bb1e61fea8054ca1db8b&oe=59D7E9DC';
    messages[0].isThumbs = true;
  }else{
    messages[0].isThumbs = false;
  }
  // if(this.state.stickgif){
  //   message[0].image =  message[0].text;
  //   message[0].text = false;
  // }
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
              this.setState({text: ''});
              this.props.getfbchatfromAgent(saveMsg);
            }



    else if(msgObj.image && msgObj.type != 'gif'){
      /*** for image file ******/
    var filename = msgObj.image.split('/');
    var fileext = filename[filename.length-1].split('.');

    console.log(filename[filename.length-1]);

      if (auth.loggedIn() === true && !msgObj.isThumbs) {
          console.log('auth.loggedIn() return true');
          const token = await auth.getToken();
            var photo = {
                  uri: msgObj.image,
                  type: 'image'+'/'+fileext[1],
                  data:msgObj.data,
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


                  this.props.uploadFbChatfile(photo,saveMsg);

            }
            else {
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
                                         url:'https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m&oh=d79f2abf6978bb1e61fea8054ca1db8b&oe=59D7E9DC',
                                       }

                                     }]
                                   },

                                  pageid:pageid

                             }
              this.props.getfbchatfromAgent(saveMsg);
            }
  }



   else if(msgObj.file){
      /*** for image file ******/
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
      console.log(msgObj.file);
      if (auth.loggedIn() === true) {
          console.log('auth.loggedIn() return true');
          const token = await auth.getToken();
            var fileobj = {
                  uri: msgObj.file.uri?msgObj.file.uri+'/'+msgObj.file.filename:msgObj.file,
                  type: 'application/'+fileext,
                  name: filename,
                  _id: msgObj._id,
              };

              console.log(fileobj);
               var saveMsg = {
                                  senderid: this.props.userdetails._id,
                                  recipientid:this.props.senderid,
                                  companyid:this.props.userdetails.uniqueid,
                                  timestamp:Date.now(),
                                  message:{
                                    mid:unique_id,
                                    seq:1,
                                    attachments:[{
                                      type:'file',
                                      payload:{
                                        url:'',
                                      }

                                    }]
                                  },

                                 pageid:pageid

                            }
                  messages[0].text = filename;
                  this.props.uploadFbChatDocfile(fileobj,saveMsg);
    }
  }
    this.state.stickgif = false;
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

  renderBubble(prop) {
    console.log("In render bubble", prop.currentMessage);
    console.log("THis render upload", this.props.upload);
    if(!prop.currentMessage.attachments && prop.currentMessage.file){
        return (
          <Text>{prop.currentMessage.text}</Text>
        );
    }
  else if(prop.currentMessage.attachments && prop.currentMessage.attachments[0].type == 'video'){
        console.log("Video", prop.currentMessage.attachments[0].payload.url);

        return (
          <WebView
        source={{uri: prop.currentMessage.attachments[0].payload.url}}
        style={{width:250,height:200,flexDirection: 'row'}}
        javaScriptEnabled={true}

      />
          // <Text>{prop.currentMessage.text}</Text>
        );
    }else if(prop.currentMessage.attachments && prop.currentMessage.attachments[0].type == 'audio'){
        console.log("Audio", prop.currentMessage.attachments[0].payload.url);
        return (
            <AudioPlayer url={prop.currentMessage.attachments[0].payload.url}/>
        );
    }else if(prop.currentMessage.attachments && prop.currentMessage.attachments[0].type == 'location'){
        console.log("Location", prop.currentMessage.attachments[0].payload.coordinates);
        return (
            <Card>
            <Text>{prop.currentMessage.attachments[0].title}</Text>
            <GoogleStaticMap
            latitude={prop.currentMessage.attachments[0].payload.coordinates.lat}
            longitude={prop.currentMessage.attachments[0].payload.coordinates.long}
            zoom={13}
            size={{ width: 200, height: 200 }}

        />
        </Card>
        );
    }
    else if(prop.currentMessage.attachments && prop.currentMessage.attachments[0].type == 'image' && prop.currentMessage.attachments[0].payload.url == 'https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m&oh=d79f2abf6978bb1e61fea8054ca1db8b&oe=59D7E9DC'){
      console.log('thumbs up');
      return (
        <Image
          style={{ width: 35, height: 35 }}
          source={{ uri: prop.currentMessage.attachments[0].payload.url }}
        />
      );
    }
    else{
      if (prop.currentMessage.isThumbs) {
        return (
          <Image
            style={{ width: 35, height: 35 }}
            source={{ uri: prop.currentMessage.image }}
          />
        );
      }
      else {
        return (
      <GChat.Bubble
        onLongPress = {() => {

          if(prop.currentMessage.attachments && prop.currentMessage.attachments[0].type == 'file'){
    console.log("In Props: ", prop.currentMessage.text);
          console.log(prop.currentMessage.attachments[0].payload.url)
          Alert.alert(
            'Download File',
            "Do you want to download this file: " + prop.currentMessage.text,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
              {text: 'OK', onPress: () => { this.props.downloadFileFromFb(prop.currentMessage.attachments[0].payload.url, prop.currentMessage.text)}},
            ]
        );}}}
        {...prop}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
    }
  }
    // this.props.downloadFile();
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




  renderComposer(props){
     console.log('renderComposer props',props);


    return(
      <View style={{flex: 1, flexDirection: 'row'}}>
        <TextInput placeholderTextColor="rgba(67,88,101,0.4)"
        placeholder="Type a message.."
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

    logEmoji (emoji, props) {
    console.log(emoji);
    this.setState({text: this.state.text + emoji});
    this.props.toggleEmoji(!this.props.emojiVisible)
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
  renderGif(nextProps){
    this.state.gifItems = [];
    for(i = 0; i < nextProps.gifs.length; i++){
      this.state.gifItems.push(<TouchableOpacity identifier={i} key={i}  onPress = {this.sendStickerGif.bind(this, nextProps.gifs[i])}><Image
          style={{width: 100, height:100 }}
          source={{uri: nextProps.gifs[i]}}
          indicator={Progress.CircleSnail }
        /></TouchableOpacity>);
    }
    console.log("In render gif");
    console.log(nextProps.gifs);
  }

  renderSticker(nextProps){
    this.state.stickerItems = [];
    for(i = 0; i < nextProps.stickers.length; i++){
      console.log("Sticker Items " + nextProps.stickers[i]);
      this.state.stickerItems.push(<TouchableOpacity identifier={i} key={i}  onPress = {this.sendStickerGif.bind(this, nextProps.stickers[i])}><Image
          style={{width: 100, height:100 }}
          source={{uri: nextProps.stickers[i]}}
          indicator={Progress.CircleSnail}
        /></TouchableOpacity>);
    }
    console.log("In render sticker");
    console.log(this.props.stickerVisible);
    console.log(nextProps.stickers);
  }

  sendStickerGif(image_uri){
    console.log("In Sticker Gif");
    console.log(image_uri);
    this.state.stickgif = true;
     var images = [];
         images.push({
              createdAt: Date.now(),
              image: image_uri,
              type: 'gif',
              user:{
                _id: 1,
              }
            })
    this.onSend(images,0);
    this.props.toggleSticker(false);
    this.props.toggleGif(false);

  }

  renderFooter(propy) {
    this.state.chatProp = propy;
      if(this.props.emojiVisible){
        return (
    <ScrollView style={styles.footerContainer}>
        <EmojiPicker
          onEmojiSelected={(emoji) => {this.logEmoji(emoji, propy)}}
          visible={this.props.emojiVisible}
          />
        </ScrollView>
      );
      }
      if(this.props.gifVisible){
        return (
    <ScrollView horizontal={true} style={styles.footerContainer}>
        {this.state.gifItems}
        </ScrollView>
      );
      }
      if(this.props.stickerVisible){
        return (
    <ScrollView horizontal={true} style={styles.footerContainer}>
      <Text>Sticker</Text>
        {this.state.stickerItems}
        </ScrollView>
      );
      }
      return null;
  }

  render() {
    return (
      <GChat.GiftedChat
        messages={this.state.messages}
        renderComposer={this.renderComposer}
        onSend={this.onSend}
        renderSend = {this.renderSend}
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
  uploadFbChatfile:FbActions.uploadFbChatfile,
  uploadFbChatDocfile:FbActions.uploadFbChatDocfile,
  toggleEmoji:FbActions.emojiToggle,
  toggleGif:FbActions.gifToggle,
  toggleSticker:FbActions.stickerToggle,
  downloadFileFromFb: FbActions.downloadFile,
};
function mapStateToProps(state) {
   const { fbcustomers,fbchats,fbchatSelected, emojiVisible, gifVisible, gifs, stickers, stickerVisible, upload} = state.fbpages;
    const { userdetails} = state.user;
  return { fbcustomers,fbchats,fbchatSelected,userdetails, emojiVisible, gifVisible, gifs, stickers, stickerVisible, upload};

}
export default connect(mapStateToProps, mapDispatchToProps)(FbChat);
