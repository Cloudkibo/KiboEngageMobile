//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var baseURLKiboEngage = `http://kiboengage.cloudapp.net`
var querystring = require('querystring');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')

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
    .then((res) => res).then(res => dispatch(writeChannels(res.data)))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readChannels());
        }
       }); 

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

/***** SQLite related *****/

/**** SQLite***/

export function callbackchannels(results) {
 var fteams = []
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row');
    console.log(row);
    fteams.push(row);
  }
  console.log(fteams);
 
  return {
    type: ActionTypes.ADD_CHANNELS,
    payload : fteams,
 
  };
}



export  function writeChannels(channels){
  var db = SqliteCalls.getConnection();
   var res = [];

  var CREATE_MESSAGE_CHANNEL_TABLE = "CREATE TABLE MESSAGECHANNELS ("
                + "_id TEXT PRIMARY KEY,"
                + "msg_channel_name TEXT,"
                + "msg_channel_description TEXT,"
                + "companyid TEXT,"
                + "groupid TEXT,"
                + "createdby TEXT,"
                + "creationdate TEXT,"
                + "activeStatus TEXT,"
                + "deleteStatus TEXT" + ")";
  

 var rows = []
 for(var i=0;i<channels.length;i++){
  var record = []
  record.push(channels[i]._id)
  record.push(channels[i].msg_channel_name);
  record.push(channels[i].msg_channel_description);
  record.push(channels[i].companyid);
  record.push(channels[i].groupid);
  record.push(channels[i].createdby);
  record.push(channels[i].creationdate);
  record.push(channels[i].activeStatus);
  record.push(channels[i].deleteStatus);
  rows.push(record);
 // addItem(db,record);

  
 }
 console.log(rows);


return (dispatch) => {
    
    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS MESSAGECHANNELS');
    tx.executeSql(CREATE_MESSAGE_CHANNEL_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO MESSAGECHANNELS VALUES (?,?,?,?,?,?,?,?,?)',rows[j]);
   
    }
    tx.executeSql('SELECT * FROM MESSAGECHANNELS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackchannels(res));
  }
  );
  
  }

}

export function readChannels(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {
    
    db.transaction(function(tx) {
   
    tx.executeSql('SELECT * FROM MESSAGECHANNELS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackchannels(res));
  }
  );
  
  }

}


