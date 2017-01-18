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

const channelCreateInAction = () => {
  return {
    type: ActionTypes.CREATE_CHANNEL,
  };
};

const channelCreateSuccess = (res) => {
  console.log('channel created');

  return {
    type: ActionTypes.CREATE_CHANNEL_SUCCESS,
    payload: res,
  };
};

const channelCreateFail = () => {
  return {
    type: ActionTypes.CREATE_CHANNEL_FAIL,
  };
};

// create channel
export const createChannel = (channel, token) => {
  var config = {
    rejectUnauthorized: false,
    headers: {
        'Authorization': `Bearer ${token}`,
    },
  };
  console.log(channel);
  return (dispatch) => {
    dispatch(channelCreateInAction());
    console.log('calling api');
    axios.post(`${baseURL}/api/messagechannels`, querystring.stringify(channel), config).then(res => dispatch(channelCreateSuccess(res)))
      .catch((error) => {
        console.log('Error occured');
        console.log(error);
        dispatch(channelCreateFail());
      });
  };
};
