//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

export function showNotifications(notifications) {
console.log(notifications.data);
  return {
    type: ActionTypes.ADD_NOTIFICATIONS,
    payload : notifications.data,

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


