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

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
/*const NotificationHub = require('react-native-azurenotificationhub/index.ios');
const connectionString = 'Endpoint=sb://kiboengagetest.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=zKwwZV4p4KNXSJg6HDFkWOhXAeZpRJ7FWicdehpM/pQ=';
const hubName = 'KiboEngageTestHub';          // The Notification Hub name
const senderID = '';         // The Sender ID from the Cloud Messaging tab of the Firebase console
const tagName = 'jekram@hotmail.com';           // The set of tags to subscribe to
*/


const NotificationHub = require('react-native-azurenotificationhub');

const connectionString = 'Endpoint=sb://kiboengagepushns.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=gDirYG/+a/dN5Md5rOXMX6QFfiFnX0Dg3kabUNCjIy0='; // The Notification Hub connection string
const hubName = 'KiboEngagePush';          // The Notification Hub name
const senderID = '626408245088';         // The Sender ID from the Cloud Messaging tab of the Firebase console
const tags = ['sojharo@gmail.com','sojharo3800399','jekram@hotmail.com'];           // The set of tags to subscribe to


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
    console.log('componentWillReceiveProps called');
    if(props.userdetails){
      console.log(props.userdetails);
      this.setState({
          userdetails: props.userdetails,
          loading : false,
        });
    }
  }
  componentDidMount = async() => {
    this.register();
    var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
     
           this.props.getuser(token);
       
            
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
 

  async _onRemoteNotification(notification) {
    console.log('notification');
    console.log(notification);
    var notif = JSON.parse(notification.message);
    console.log(notif);
    
    Alert.alert(
      'Push Notification Received',
      'Alert message: ' + notif.data.status,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
    
    if(notif.data.type == 'fbchat'){
          var token =  await auth.getToken();
          // console.log('token is Launchview is: ' + token);
          if(token != ''){
            this.props.fetchfbcustomers(token);
            this.props.getfbChatsUpdate(token,this.props.fbchatSelected);

            //this.forceUpdate();
            
           }
    }
  }


}



const mapDispatchToProps = {
  getuser: UserActions.getuser,
  getsqlData:UserActions.getsqlData,

  fetchfbcustomers: FbActions.fetchfbcustomers,
  getfbChats:FbActions.getfbChats,
  getfbChatsUpdate:FbActions.getfbChatsUpdate,
 };

function mapStateToProps(state) {
   const { userdetails,fetchedR} = state.user;
   const {fbchatSelected} = state.fbpages;
  return {userdetails,fetchedR,fbchatSelected};

}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
