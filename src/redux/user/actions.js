/**
 * User Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');
import { Actions } from 'react-native-router-flux';

import {
  AsyncStorage,
} from 'react-native'

var STORAGE_KEY = 'id_token';

export function showUsername(user) {
  console.log(user);
  return {
    type: ActionTypes.ADD_USER_DETAILS,
    payload : user.data,

  };
}
export const getuser = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/users/me`,config)
    .then((res) => res).then(res => dispatch(showUsername(res)))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error.response.status == 401){ Actions.login()}
       
      });
;
      
  };
};

export const logout = ()=>{
  console.log('logout is called');
  AsyncStorage.removeItem(STORAGE_KEY);
  console.log('removeItem AsyncStorage ');
  Actions.splash();
   return {
    type: ActionTypes.LOGOUT,
    
  };
}