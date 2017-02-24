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
import Loading from '@components/general/Loading';
// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
const NotificationHub = require('react-native-azurenotificationhub/index.ios');
const connectionString = 'Endpoint=sb://kiboengagetest.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=zKwwZV4p4KNXSJg6HDFkWOhXAeZpRJ7FWicdehpM/pQ=';
const hubName = 'KiboEngageTestHub';          // The Notification Hub name
const senderID = '';         // The Sender ID from the Cloud Messaging tab of the Firebase console
const tagName = 'jekram@hotmail.com';           // The set of tags to subscribe to



var remoteNotificationsDeviceToken = '';  // The device token registered with APNS

/* Component ==================================================================== */
class DashboardiOS extends Component {
  static componentName = 'DashboardiOS';

 
  constructor(props) {
    super(props);
    
    this.state = {'userdetails' : null,loading : true,connectionInfo:''};
    this.register = this.register.bind(this);
    
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
    if(props.userdetails){
      console.log(props.userdetails);
      this.setState({
          userdetails: props.userdetails,
          loading : false,
        });
    }


    if(props.fetchedR){
       var len = props.fetchedR.rows.length;
        for (let i = 0; i < len; i++) {
          let row = props.fetchedR.rows.item(i);
          console.log(`Employee name: ${row.name}, Dept Name: ${row.score}`);
        }

    }
  }
 

  componentDidMount = async() => {
  

    this.requestPermissions();
    var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
     
           this.props.getuser(token);
           this.props.getsqlData();
            
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

        <TouchableOpacity onPress={this.register.bind(this)}>
         <View style={styles.button}>
           <Text style={styles.buttonText}>
             Register
           </Text> 
         </View>
       </TouchableOpacity>
      </View>
      );
    
    
  }
   _onRegistered(deviceToken) {
    remoteNotificationsDeviceToken = deviceToken;
    //this.register();
    
    Alert.alert(
      'Registered For Remote Push',
      `Device Token: ${deviceToken}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );

     
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

  _onRemoteNotification(notification) {
    console.log('notification');
    console.log(notification);
    Alert.alert(
      'Push Notification Received',
      'Alert message: ' + notification.message,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
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
  getuser: UserActions.getuser,
  getsqlData:UserActions.getsqlData,
 };

function mapStateToProps(state) {
   const { userdetails,fetchedR} = state.user;
  
  return {userdetails,fetchedR};

}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardiOS);
