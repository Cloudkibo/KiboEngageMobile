import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')

import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

export function updatePageStats(data) {
  return {
    type: ActionTypes.FETCH_PAGE_STATS,
    payload : data,

  };
}

export function updateCountryStats(data) {
  return {
    type: ActionTypes.FETCH_COUNTRY_STATS,
    payload : data,

  };
}

export function updateAgentStats(data) {
  return {
    type: ActionTypes.FETCH_AGENT_STATS,
    payload : data,

  };
}

export function updateTeamStats(data) {
  return {
    type: ActionTypes.FETCH_TEAM_STATS,
    payload : data,

  };
}

export function updateNotificationStats(data) {
  return {
    type: ActionTypes.FETCH_NOTIFICATION_STATS,
    payload : data,

  };
}

export function updateChannelStats(data) {
  return {
    type: ActionTypes.FETCH_CHANNEL_STATS,
    payload : data,

  };
}


export const fetchChannelStats =  (token, data) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
          'Authorization': token,
          'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      var body = {
        'departmentid': data,
      }
    console.log("Fetching Channel", config , body);
  return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/getsubgroupwisecalls`,querystring.stringify(body), config)
    .then((res) => res).then(res => {
      console.log("Channel Stats", res.data.body);
      dispatch(updateChannelStats(res.data.body));
})
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
    console.log("Fetch Country", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getplatformwisecalls`,config)
    .then((res) => res).then(res => {
      console.log("Country Stats", res.data.info);
      dispatch(updateCountryStats(res.data.info));
  })
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
    console.log("Fetch Team", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getdeptwisecalls`,config)
    .then((res) => res).then(res => {
      console.log("Team Stats  Action", res.data.info);
      dispatch(updateTeamStats(res.data.info));
    })
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
    console.log("Fetch Agents", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getagentwisecalls`,config)
    .then((res) => res).then(res => {
      console.log("Agent Stats", res.data.info);
      dispatch(updateAgentStats(res.data.info));
    })
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
    console.log("Fetch Page Stats", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getpagewisecalls`,config)
    .then((res) => res).then(res => {
      console.log("Page Stats", res);
      dispatch(updatePageStats(res.data.info))
    })
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
    console.log("Fetch Notification Stats", config);
  return (dispatch) => {
    axios.get(`${baseURLKiboEngage}/api/getagentnotifications`,config)
    .then((res) => res).then(res =>{ 
       console.log("Notification Stats", res.data.info);
      dispatch(updateNotificationStats(res.data.info));
  })
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
