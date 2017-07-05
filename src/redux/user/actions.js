/**
 * User Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import { Actions } from 'react-native-router-flux';
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

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
        if(error === 'Network Error')
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
};

export const updateprofile = (user, token) => {
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/json'
            },
          };
      var form =  {
        'firstname': user.firstname,
        'lastname': user.lastname,
        'phone': user.phone,
        'country': user.country,
        'state': user.state,
        'city': user.city,
          };

  return (dispatch) => {
    console.log('calling api');
    axios.post(`${baseURL}/api/users/updateprofile`, form, config).then(res => {
      dispatch(updateProfileSuccess(res));
      dispatch(getuser(token));
    })
      .catch(function (error) {
        console.log(error.response)
        console.log('Error occured');
        console.log(error);
        dispatch(updateProfileFailure());
      });
  };
};


export  function writeGroups(groups){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Groups_TABLE = "CREATE TABLE USER_DETAILS ("
                + "_id TEXT PRIMARY KEY,"
                + "abandonedemail1 TEXT,"
                + "abandonedemail2 TEXT,"
                + "abandonedemail3 TEXT,"
                + "accountVerified TEXT,"
                + "allowchime TEXT,"
                + "allownotification TEXT,"
                + "canExcludeAgent TEXT,"
                + "city TEXT,"
                + "companyName TEXT,"
                + "completedemail1 TEXT,"
                + "completedemail2 TEXT,"
                + "completedemail3 TEXT,"
                + "country TEXT,"
                + "date TEXT,"
                + "email TEXT,"
                + "firstname TEXT,"
                + "canIncludeAgent TEXT,"
                + "canIncludeAgent TEXT,"
                + ")";

 var rows = []
 for(var i=0;i<groups.length;i++){
  var record = []
  record.push(groups[i]._id)
  record.push(groups[i].deptname);
  record.push(groups[i].deptdescription);
  record.push(groups[i].companyid);
  record.push(groups[i].createdby._id);
  record.push(groups[i].creationdate);
  record.push(groups[i].deleteStatus);
  record.push(groups[i].isFbGroup);
  record.push(groups[i].fbPageID?groups[i].fbPageID:"");
  rows.push(record);
 // addItem(db,record);


 }
 console.log(rows);


return (dispatch) => {

    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS GROUPS');
    tx.executeSql(CREATE_Groups_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO GROUPS VALUES (?,?,?,?,?,?,?,?,?)',rows[j]);

    }
    tx.executeSql('SELECT * FROM GROUPS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;

        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackgroups(res));
  }
  );

  }

}



const updateProfileFailure = () => {
  return { type: ActionTypes.UPDATE_PROFILE_FAIL };
};

const updateProfileSuccess = (res) => {
  return {
    type: ActionTypes.UPDATE_PROFILE_SUCCESS,
    payload: res,
  };
};
