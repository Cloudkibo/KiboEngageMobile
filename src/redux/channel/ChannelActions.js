//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

export function showChannels(channels) {
console.log(channels.data);
  return {
    type: ActionTypes.ADD_CHANNELS,
    payload : channels.data,

  };
}

export const channelFetch = (token) => {
  console.log('notifications fetch is called');
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/messagechannels`,config)
    .then((res) => res).then(res => dispatch(showChannels(res)));
      
  };
};


