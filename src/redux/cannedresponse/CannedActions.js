//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

export function showResponses(cannedresponses) {
  console.log(cannedresponses);
  return {
    type: ActionTypes.ADD_CANNED_RESPONSES,
    payload : cannedresponses.data,

  };
}

export const cannedFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/shortcuts`,config)
    .then((res) => res).then(res => dispatch(showResponses(res)));
      
  };
};

