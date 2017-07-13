//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

export function showNotifications(notifications) {
console.log(notifications.data);
  return {
    type: ActionTypes.ADD_NOTIFICATIONS,
    payload : notifications.data,

  };
}


export function resetNotifications() {
  return {
    type: ActionTypes.RESET_NOTIFICATIONS,
  };
}

export const notificationFetch = (token) => {
  console.log('notifications fetch is called');
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/notifications`,config)
    .then((res) => res).then(res => dispatch(showNotifications(res)));
      
  };
};



export const createNotification = (notification) => {
  console.log('notifications create is called');
  
  var token = notification.token;
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': token,
            'Content-Type': 'application/json'
            },
      
          };

      var data =  {
        'notification': notification.notification,
        

      }
  console.log(data);
      
  return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/createNotification`,data,config).then(res => dispatch(notificationCreateSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(notificationCreateFail());
      });

  };
};



export const resendNotification = (notification) => {
  console.log('notifications resend is called');
  
  var token = notification.token;
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': token,
            'Content-Type': 'application/json'
            },
      
          };

      var data =  {
        'notification': notification.notification,
        

      }
  console.log(data);
      
  return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/resendNotification`,data,config).then(res => dispatch(notificationResendSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(notificationResendFail());
      });

  };
};


const notificationCreateFail = () => {
  return{ type: ActionTypes.CREATE_NOTIFICATION_FAIL };
};

const notificationCreateSuccess = (res) => {
  console.log('notification created');
  //Actions.main();
  return{
    type: ActionTypes.CREATE_NOTIFICATION_SUCCESS,
    payload: res
  };


};


const notificationResendFail = () => {
  return{ type: ActionTypes.RESEND_NOTIFICATION_FAIL };
};

const notificationResendSuccess = (res) => {
  console.log('notification created');
  //Actions.main();
  return{
    type: ActionTypes.RESEND_NOTIFICATION_SUCCESS,
    payload: res
  };


};

