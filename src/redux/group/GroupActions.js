import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var baseURLKiboEngage = `http://kiboengage.cloudapp.net`
var querystring = require('querystring');
//var baseURLKiboEngage = `http://localhost:8000`
export function showGroups(groups) {
  console.log(groups.data);
    return {
      type: ActionTypes.ADD_GROUPS,
      payload : groups.data,

    };
}

export const groupFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/groups`,config)
    .then((res) => res).then(res => dispatch(showGroups(res)));

  };
};