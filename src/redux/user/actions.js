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
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')
import {
 
  Alert,
 
} from 'react-native';
import {
  AsyncStorage,
} from 'react-native'

var STORAGE_KEY = 'id_token';
export function callbackme(results) {
 
  console.log(results);
  return {
    type: ActionTypes.ADD_FETCHED_RESULT,
    payload : results,
 
  };
}
export function getsqlData(){
  var db = SqliteCalls.getConnection();
  var res = [];
   return (dispatch) => {
    
    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DemoTable');
    tx.executeSql('CREATE TABLE DemoTable (name, score)');
    tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
    tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
    tx.executeSql('SELECT * FROM DemoTable', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackme(res));
  }
  );
  
  }
}
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
        if(error = 'Network Error')
          Alert.alert('You are not connected with Internet');
        if(error.response && error.response.status == 401){ Actions.login()}
        
      });

      
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