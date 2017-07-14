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
    .then((res) => res).then(res => 

      {
      dispatch(writeUserDetails(res.data));

      //dispatch(readusers());
    }
      //  dispatch(showUsername(res));}
      )
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
     
        if(error.response && error.response.status == 401){ Actions.login()}
        else{
             // Alert.alert('Error occured');
              dispatch(readusers());
       
        }
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


export  function writeUserDetails(users){
  console.log('inside write user');
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_USER_DETAILS_TABLE = "CREATE TABLE USER_DETAILS ("
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
                + "date DATETIME,"
                + "email TEXT,"
                + "firstname TEXT,"
                + "invitedemail1 TEXT,"
                + "invitedemail2 TEXT,"
                + "invitedemail3 TEXT,"
                + "isAdmin TEXT,"
                + "isAgent TEXT,"
                + "isOwner TEXT,"
                + "isDeleted TEXT,"
                + "isSupervisor TEXT,"
                + "lastname TEXT,"
                + "phone TEXT,"
                + "role TEXT,"
                + "state TEXT,"
                + "uniqueid TEXT,"
                + "website TEXT"
                + ")";

 var rows = []
 console.log('...');
 console.log(users.length);
 console.log(users);
 for(var i=0;i<1;i++){

  console.log(i);
  var record = []
  record.push(users._id)
  record.push(users.abandonedemail1);
  record.push(users.abandonedemail2);
  record.push(users.abandonedemail3);
  record.push(users.accountVerified);
  record.push(users.allowchime);
  record.push(users.allownotification);
  record.push(users.canExcludeAgent);
  record.push(users.city?users.city:"");
  record.push(users.companyName?users.companyName:"");
  record.push(users.completedemail1?users.completedemail1:"");
  record.push(users.completedemail2?users.completedemail2:"");
  record.push(users.completedemail3?users.completedemail3:"");
  //country
  record.push(users.country);
  record.push(users.date);
  record.push(users.email?users.email:"");
  record.push(users.firstname?users.firstname:"");
  record.push(users.invitedemail1?users.invitedemail1:"");
  record.push(users.invitedemail2?users.invitedemail2:"");
  record.push(users.invitedemail3?users.invitedemail3:"");
  record.push(users.isAdmin);
  record.push(users.isAgent);
  record.push(users.isOwner);
  record.push(users.isDeleted);
  record.push(users.isSupervisor);
  record.push(users.lastname?users.lastname:"");
  record.push(users.phone);
  record.push(users.role);
  record.push(users.state);
  record.push(users.uniqueid);
  record.push(users.website);
  rows.push(record);
 // addItem(db,record);


 }
 console.log(rows);


return (dispatch) => {

    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS USER_DETAILS');
    tx.executeSql(CREATE_USER_DETAILS_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO USER_DETAILS VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',rows[j]);

    }
    tx.executeSql('SELECT * FROM USER_DETAILS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;

        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackusers(res));
  }
  );

  }

}


export function callbackusers(results) {
 var userdetails = {};
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row');
    console.log(row);
    userdetails=row;
  }
  console.log('userdetails');
  console.log(results);

  return {
    type: ActionTypes.ADD_USER_DETAILS,
    payload : userdetails,

  };
}



export function readusers(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {

    db.transaction(function(tx) {

    tx.executeSql('SELECT * FROM USER_DETAILS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;

        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackusers(res));
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
