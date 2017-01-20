//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var baseURLKiboEngage = `http://kiboengage.cloudapp.net`
var querystring = require('querystring');
//var baseURLKiboEngage = `http://localhost:8000`
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



export const editChannel = (channel,token) => {
    console.log('editchannel is called');
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': token,
            'content-type' : 'application/json'
            },
      
          };
      var data =  {
       'channel' : channel,
      
      }
  console.log(data);
  
  return (dispatch) => {
    console.log('calling api');
    console.log(config.headers.authorization);
    axios.post(`${baseURLKiboEngage}/api/editChannel`,data,config).then(res => dispatch(channelEditSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(channelEditFail());
      });
    
  };
};



export const deleteChannel = (channel,token) => {
    console.log('deleteChannel is called');
    var config = {
     
      rejectUnauthorized : false,
      headers: {
            'Authorization': token,
            'content-type' : 'application/json'
            },
      data : {
       'channel' : channel,
      
      }
          };
    
  
  
  return (dispatch) => {
    console.log('calling api');
    console.log(config.headers.authorization);
    axios.delete(`${baseURLKiboEngage}/api/deleteChannel?id=${channel._id}`,config).then(res => dispatch(channelDeleteSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(channelDeleteFail());
      });
    
  };
};

const channelEditFail = () => {
  return{ type: ActionTypes.EDIT_CHANNEL_FAIL };
};

const channelEditSuccess = (res) => {
  //Actions.main();
  return{
    type: ActionTypes.EDIT_CHANNEL_SUCCESS,
    payload: res
  };

  
};



const channelDeleteFail = () => {
  return{ type: ActionTypes.DELETE_CHANNEL_FAIL };
};

const channelDeleteSuccess = (res) => {
  //Actions.main();
  return{
    type: ActionTypes.DELETE_CHANNEL_SUCCESS,
    payload: res
  };

  
};

