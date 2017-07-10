/**
 * Login Screen
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  View,
  AlertIOS,
  Alert,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import auth from '../services/auth';
import { DeviceEventEmitter } from 'react-native';
// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles } from '@theme/';
import { connect } from 'react-redux';
import * as UserActions from '@redux/user/actions';
import Loading from '@components/general/Loading';
import * as FbActions from '@redux/facebook/FbActions';
import * as chatActions from '@redux/chat/chatActions';

import * as menuActions from '@redux/sidemenu/actions';
import codePush from "react-native-code-push";
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
/*const NotificationHub = require('react-native-azurenotificationhub/index.ios');
const connectionString = 'Endpoint=sb://kiboengagetest.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=zKwwZV4p4KNXSJg6HDFkWOhXAeZpRJ7FWicdehpM/pQ=';
const hubName = 'KiboEngageTestHub';          // The Notification Hub name
const senderID = '';         // The Sender ID from the Cloud Messaging tab of the Firebase console
const tagName = 'jekram@hotmail.com';           // The set of tags to subscribe to
*/


const NotificationHub = require('react-native-azurenotificationhub');

const connectionString = 'Endpoint=sb://kiboengagetesthub.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=XitK1UR1T+Tb5Hi2btmM/jNEmTvCO/5ocyfXYhhDaVs='; // The Notification Hub connection string
const hubName = 'kiboengagetesthub';          // The Notification Hub name
const senderID = '626408245088';         // The Sender ID from the Cloud Messaging tab of the Firebase console
const tags = [];           // The set of tags to subscribe to


var remoteNotificationsDeviceToken = '';  // The device token registered with APNS

/* Component ==================================================================== */
class Dashboard extends Component {
  static componentName = 'Dashboard';


  constructor(props) {
    super(props);

    this.state = {'userdetails' : null,loading : true};
    this.register = this.register.bind(this);
   this._onRemoteNotification = this._onRemoteNotification.bind(this);

  }



  async register() {
    console.log('registerering to hub');
    var token = NotificationHub.register({connectionString, hubName, senderID, tags})

    try {
    var {
     message
    } = await NotificationHub.register({connectionString, hubName, senderID, tags});

    Alert.alert(
            'Registered For Remote Push',
            'Sucessfully registered',

            [{
              text: 'Dismiss',
              onPress: null,
            }]
          );

  } catch (e) {
   Alert.alert(
            'Registered For Remote Push',
            'Error occured',

            [{
              text: 'Dismiss',
              onPress: null,
            }]
          );

  }
  }

  unregister() {
    console.log('unregisterering to hub');
    NotificationHub.unregister();
  }
  componentWillReceiveProps(props){
    if((this.props.userdetails && props.userdetails.email != this.props.userdetails.email) ||  !this.props.userdetails){
      console.log(props.userdetails);
      this.setState({
          userdetails: props.userdetails,
          loading : false,
        });
       tags.push('Agent-'+props.userdetails.email);
       this.register();
    }
  }
  componentDidMount = async() => {
    this.props.closemenu();
    //this.register();
    var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){

           this.props.getuser(token);
           this.props.sessionsFetch(token);

          }

  }

  componentWillMount() {
   /* this.addListenerOn(DeviceEventEmitter,
                       'onNotificationReceived',
                       this._onRemoteNotification);*/
    DeviceEventEmitter.addListener('onNotificationReceived', this._onRemoteNotification);


  }

  rendername(){
   return (
     <View style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
        <Card>
          <Text> Hello {this.state.userdetails.firstname}</Text>
        </Card>
      </View>

    );
  }

renderLoadingView(){
   return (
     <View style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
        <Card>
          <Text> Loading User data ...</Text>
        </Card>
      </View>

    );
  }
  render = () => {
     if (this.state.loading) return <Loading />;


      return(<View style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
        <Card>
          <Text> Hello {this.props.userdetails.firstname}</Text>
        </Card>


      </View>
      );


  }


  async _onRemoteNotification(notification) {
    console.log('notification');
    console.log(notification);
    var notif = JSON.parse(notification.message);
    console.log("Notif", notif);

    Alert.alert(
      'Push Notification Received',
      'Alert message: ' + notif.data.status,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
    console.log("Current Chat", this.props.chat);
    if(notif.data.type == 'fbchat'){
          var token =  await auth.getToken();
          // console.log('token is Launchview is: ' + token);
          if(token != ''){
            this.props.fetchChatSessions(token);
            this.props.getfbChatsUpdate(token,this.props.currentSession);

            //this.forceUpdate();

           }
    }
    if (notif.data.type == 'chatsession') {
      console.log('notification receieved');
      console.log(notif.data);
      console.log(this.props.data);
      const token = await auth.getToken();
      this.props.fetchSingleChat(token, notif.data);
      this.props.sessionsFetch(token);
    }
    /*if(notif.data.request_id && notif.data.uniqueid){
      console.log("Fetching the receieved chat");
          var token =  await auth.getToken();
          // console.log('token is Launchview is: ' + token);
          if(token != ''){
            if(notif.data.request_id == this.props.singleChat.request_id){
              this.props.fetchChat(token, notif.data);
            }

           }

    }*/
    if(notif.data.type == "fb_chat_assigned"){
            console.log("Updating FbSession Status to assigned");
            var newSessions = this.props.fbSessions.map((obj) => {
              if(obj.pageid._id == notif.data.pageid){
                obj.status = 'assigned';
              }
              return obj;
            });
            this.props.updateFbSessionsAssignedStatus(newSessions);
            //this.forceUpdate();
    }


    if(notif.data.type == "fbchat_resolved"){
            console.log("Updating FbSession Status to resolved");
            var newSessions = this.props.fbSessions.map((obj) => {
              if(obj.pageid._id == notif.data.pageid){
                obj.status = 'resolved';
              }
              return obj;
            });
            this.props.updateFbSessionsAssignedStatus(newSessions);
            //this.forceUpdate();

  }

}
}



const mapDispatchToProps = {
  getuser: UserActions.getuser,
  getsqlData:UserActions.getsqlData,
  fetchChat: chatActions.fetchChat,
  fetchSingleChat: chatActions.fetchSingleChat,
  fetchSingleSession: chatActions.fetchSingleSession,
  fetchChatSessions: FbActions.fetchChatSessions,
  fetchfbcustomers: FbActions.fetchfbcustomers,
  getfbChats:FbActions.getfbChats,
  getfbChatsUpdate:FbActions.getfbChatsUpdate,
  sessionsFetch: chatActions.sessionsFetch,
  updateFbSessionsAssignedStatus: FbActions.updateFbSessionsAssignedStatus,
    closemenu: menuActions.close,
 };

function mapStateToProps(state) {
  const { userdetails, fetchedR } = state.user;
  const { fbchatSelected, fbSessions, currentSession } = state.fbpages;
  const { chat, singleChat, data } = state.chat;

  return { userdetails, fetchedR, fbchatSelected, chat, singleChat, fbSessions, currentSession, data };

}
// Dashboard = codePush(codePushOptions)(Dashboard);


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
