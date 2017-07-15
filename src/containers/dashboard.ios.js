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
  NetInfo,
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
import * as FbActions from '@redux/facebook/FbActions';
import * as chatActions from '@redux/chat/chatActions';
import * as menuActions from '@redux/sidemenu/actions';
import Loading from '@components/general/Loading';
// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
//import codePush from "react-native-code-push";
//let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

const NotificationHub = require('react-native-azurenotificationhub/index.ios');
const connectionString = 'Endpoint=sb://kiboengagetesthub.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=XitK1UR1T+Tb5Hi2btmM/jNEmTvCO/5ocyfXYhhDaVs=';
const hubName = 'kiboengagetesthub';          // The Notification Hub name
const senderID = '';         // The Sender ID from the Cloud Messaging tab of the Firebase console
const tagName = '';           // The set of tags to subscribe to



var remoteNotificationsDeviceToken = '';  // The device token registered with APNS

/* Component ==================================================================== */
class Dashboard extends Component {
  static componentName = 'Dashboard';

 
  constructor(props) {
    super(props);
    
    this.state = {'userdetails' : null,loading : true,connectionInfo:''};
   // this.register = this.register.bind(this);
   this._onRemoteNotification = this._onRemoteNotification.bind(this);
   this.requestPermissions = this.requestPermissions.bind(this);

  }
 
  requestPermissions() {
    NotificationHub.addEventListener('register', this._onRegistered);
    NotificationHub.addEventListener('registrationError', this._onRegistrationError);
    NotificationHub.addEventListener('registerAzureNotificationHub', this._onAzureNotificationHubRegistered);
    NotificationHub.addEventListener('azureNotificationHubRegistrationError', this._onAzureNotificationHubRegistrationError);
    NotificationHub.addEventListener('notification', this._onRemoteNotification);
    NotificationHub.addEventListener('localNotification', this._onLocalNotification);

   NotificationHub.requestPermissions();
  }

  async register() {
    console.log('registerering to hub');
   // var token = NotificationHub.register({connectionString, hubName, senderID, tags})
    
    try {
    var {
     message
    } = await NotificationHub.register(remoteNotificationsDeviceToken,{connectionString, hubName, senderID, tagName});

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
    console.log('componentWillReceiveProps called');
    if((this.props.userdetails && props.userdetails.email != this.props.userdetails.email) ||  !this.props.userdetails){
      console.log(props.userdetails);
      this.setState({
          userdetails: props.userdetails,
          loading : false,
        });
       tagName = 'Agent-'+props.userdetails.email; 
      this.requestPermissions();
    }


  
  }
 

  componentDidMount = async() => {
  console.log('login component did mount');
    this.props.closemenu();
    NotificationHub.addEventListener('register', this._onRegistered);
    NotificationHub.addEventListener('registrationError', this._onRegistrationError);
    NotificationHub.addEventListener('registerAzureNotificationHub', this._onAzureNotificationHubRegistered);
    NotificationHub.addEventListener('azureNotificationHubRegistrationError', this._onAzureNotificationHubRegistrationError);
    NotificationHub.addEventListener('notification', this._onRemoteNotification);
    NotificationHub.addEventListener('localNotification', this._onLocalNotification);
   

    var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
     
           this.props.getuser(token);
         //  this.props.getsqlData();
            
          }
    
      

   
  
  }

  componentWillMount() {
   /* this.addListenerOn(DeviceEventEmitter,
                       'onNotificationReceived',
                       this._onRemoteNotification);*/
   // DeviceEventEmitter.addListener('onNotificationReceived', this._onRemoteNotification);
 
  
  }
  
  rendername(){

        
   return (
     <View style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
        <Card>
         <Text> Hello This is {this.state.userdetails.firstname}</Text>
          
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
        console.log('rendername');
     //console.log(this.props.userdetails);
     //   console.log(this.props.userdetails.lastname);
     if (this.state.loading) return <Loading />;
      

      return(<View style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
        <Card>
          <Text> Hello This is{this.props.userdetails.firstname}</Text>
         
        </Card>

       
      </View>
      );
    
    
  }

  
   async _onRegistered(deviceToken) {
    remoteNotificationsDeviceToken = deviceToken;
    //this.register();
    
    Alert.alert(
      'Registered For Remote Push',
      `Device Token: ${deviceToken} ${tagName}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );

     console.log('registerering to hub');
   // var token = NotificationHub.register({connectionString, hubName, senderID, tags})
    
    try {
    var {
     message
    } = await NotificationHub.register(remoteNotificationsDeviceToken,{connectionString, hubName, senderID, tagName});

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

  _onRegistrationError(error) {
    Alert.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  async _onRemoteNotification(notification) {
    console.log('notification');
    console.log(notification);
    var notif = notification._data;
    Alert.alert(
      'Push Notification Received',
      'Alert message: ' + notification._data.data.status,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );

    if(notification._data.data.type == 'fbchat'){
          var token =  await auth.getToken();
          // console.log('token is Launchview is: ' + token);
          if(token != ''){
            this.props.fetchfbcustomers(token);
            this.props.getfbChatsUpdate(token,this.props.currentSession);

            //this.forceUpdate();
            
           }
    }

        //chat message received from mobile/web client
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
           // this.forceUpdate();
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
           // this.forceUpdate();
    
  }
}
  

  _onAzureNotificationHubRegistered(registrationInfo) {
    console.log('registered');
    console.log(registrationInfo);
    Alert.alert('Registered For Azure notification hub',
      'Registered For Azure notification hub'
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _onAzureNotificationHubRegistrationError(error) {
    Alert.alert(
      'Failed To Register For Azure Notification Hub',
      `Error (${error.code}): ${error.message}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _onLocalNotification(notification){
    Alert.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

}



const mapDispatchToProps = {
   closemenu: menuActions.close,
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
 };

function mapStateToProps(state) {
   const { userdetails,fetchedR} = state.user;
   const {fbchatSelected, fbSessions,currentSession} = state.fbpages;
   const { chat, singleChat, data } = state.chat;

  return { userdetails, fetchedR, fbchatSelected, chat, singleChat, fbSessions, currentSession, data };


}
//Dashboard = codePush(codePushOptions)(Dashboard);
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

