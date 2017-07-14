//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

//var baseURLKiboEngage = `http://localhost:8000`
export function showChannels(subgroups) {
console.log(subgroups.data);
  return {
    type: ActionTypes.ADD_CHANNELS,
    payload : subgroups.data,

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
    dispatch(readChannels());
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
  console.log('subgroup created');

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

// create subgroup
export const createChannel = (subgroup, token) => {
  var config = {
    rejectUnauthorized: false,
    headers: {
        'Authorization': `Bearer ${token}`,
    },
  };
  console.log(subgroup);
  return (dispatch) => {
    dispatch(channelCreateInAction());
    console.log('calling api');
    axios.post(`${baseURL}/api/messagechannels`, querystring.stringify(subgroup), config).then

    (res => dispatch(channelCreateSuccess(res))

      )
      .catch((error) => {
        console.log('Error occured');
        console.log(error);
        dispatch(channelCreateFail());
      });
  };
};


export const resetStatus = () => {
  return {
    type: ActionTypes.RESET_STATUS,
  };
}

export const editSubgroup = (subgroup,token) => {
    console.log('editchannel is called');
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': token,
            'content-type' : 'application/json'
            },

          };
      var data =  {
       'subgroup' : subgroup,

      }
  console.log(data);

  return (dispatch) => {
    console.log('calling api');
    console.log(config.headers.authorization);
    axios.post(`${baseURLKiboEngage}/api/editSubgroup`,data,config).then(res => {
      dispatch(channelEditSuccess(res));
      dispatch(channelFetch(token));
    })
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(channelEditFail());
      });

  };
};



export const deleteSubgroup = (subgroup,token) => {
    console.log('deleteSubgroup is called');
    var config = {

      rejectUnauthorized : false,
      headers: {
            'Authorization': token,
            'content-type' : 'application/json'
            },
      data : {
       'subgroup' : subgroup,

      }
          };



  return (dispatch) => {
    console.log('calling api');
    console.log(config.headers.authorization);
    axios.delete(`${baseURLKiboEngage}/api/deleteSubgroup?id=${subgroup._id}`,config).then(res => 

      {dispatch(channelDeleteSuccess(res));
      dispatch(channelFetch(token));

    })
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

export function callbacksubgroups(results) {
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



export  function writeChannels(subgroups){
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
 for(var i=0;i<subgroups.length;i++){
  var record = []
  record.push(subgroups[i]._id)
  record.push(subgroups[i].msg_channel_name);
  record.push(subgroups[i].msg_channel_description);
  record.push(subgroups[i].companyid);
  record.push(subgroups[i].groupid);
  record.push(subgroups[i].createdby);
  record.push(subgroups[i].creationdate);
  record.push(subgroups[i].activeStatus);
  record.push(subgroups[i].deleteStatus);
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
           dispatch(callbacksubgroups(res));
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
           dispatch(callbacksubgroups(res));
  }
  );

  }

}



// Assign Agent
export const assignChannel = (token, input) => {
  console.log("Move Channel Called");
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': token,
            'content-type': 'application/json',
            },

          };
          console.log("After config");
      var data =  {
           companyid : input.companyid,
           sessionid : input.requestid,
           channelAssignment : {
            movedto : input.channel_to,
            movedfrom : input.channel_from,
            movedby : input.agentidBy,
            sessionid  :  input.requestid,
            companyid  : input.companyid ,
            datetime   : Date.now(),
          },
      };
      console.log("After data");
  console.log(data);
    return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/movedToMessageChannel`, data,config)
      .then((res) => {
        // dispatch(confirmInvite(res))
        console.log("Channel Successfully Assigned");
        console.log(res);
        dispatch(assign_agent_status('Successfully Moved'));
      })
      .catch(function (error) {
        console.log('Error occured in assigning subgroup');
        console.log(error);
        dispatch(assign_agent_status('Error Occurred'));
        // dispatch(confirmInvite(error));
      });
  };
};

export function assign_agent_status(data) {
  return {
    type: ActionTypes.ASSIGN_AGENT,
    payload : data,
  };
}
