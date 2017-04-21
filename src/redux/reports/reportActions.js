import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')

import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

export function updateChannelStats(data) {
  // console.log('show agents');
  // console.log(agents);
  return {
    type: ActionTypes.ADD_AGENTS,
    payload : agents.data.agents,

  };
}


export const fetchChannelStats =  (token) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
          'Authorization': token,
           'Content-Type': 'application/json',
            },
      
          };
    console.log("Fetch Channel", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getchannelwisecalls`,config)
    .then((res) => res).then(res => console.log(res))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
        }
       }); 
      
  };
};


export const fetchCountryStats =  (token) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
          'Authorization': token,
           'Content-Type': 'application/json',
            },
      
          };
    console.log("Fetch Channel", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getplatformwisecalls`,config)
    .then((res) => res).then(res => console.log(res))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
        }
       }); 
      
  };
};


export const fetchTeamStats =  (token) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
          'Authorization': token,
           'Content-Type': 'application/json',
            },
      
          };
    console.log("Fetch Channel", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getdeptwisecalls`,config)
    .then((res) => res).then(res => console.log(res))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
        }
       }); 
      
  };
};

export const fetchAgentStats =  (token) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
          'Authorization': token,
           'Content-Type': 'application/json',
            },
      
          };
    console.log("Fetch Channel", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getagentwisecalls`,config)
    .then((res) => res).then(res => console.log(res))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
        }
       }); 
      
  };
};

export const fetchPageStats =  (token) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
          'Authorization': token,
           'Content-Type': 'application/json',
            },
      
          };
    console.log("Fetch Channel", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getpagewisecalls`,config)
    .then((res) => res).then(res => console.log(res))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
        }
       }); 
      
  };
};

export const fetchNotificationStats =  (token) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
          'Authorization': token,
           'Content-Type': 'application/json',
            },
      
          };
    console.log("Fetch Channel", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getagentnotifications`,config)
    .then((res) => res).then(res => console.log(res))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
        }
       }); 
      
  };
};
