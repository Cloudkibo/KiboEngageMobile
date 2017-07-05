import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')

import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

export function showAgents(agents) {
  // console.log('show agents');
  // console.log(agents);
  return {
    type: ActionTypes.ADD_AGENTS,
    payload : agents.data.agents,

  };
}


export const agentFetch =  (token,userid) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
          'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/users/allagents`,config)



.then((res) => res).then(res => dispatch(writeAgents(res.data.agents.filter((s) => s._id != userid))))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          console.log('myID ...')
          console.log(userid)
          dispatch(readAgents());
        }
       });

  };
};

export const agentInvite =  (token, inviteEmail) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/json',
            },

          };
       var data =  {
          email: inviteEmail
      }


  // console.log("THis is the token in action " + token);
  return (dispatch) => {
    axios.post(`${baseURL}/api/tempaccounts/kiboengage`, data,config)
      .then((res) => dispatch(confirmInvite(res)))
      .catch(function (error) {
        // console.log('Error occured');
        // console.log(error);
        dispatch(confirmInvite(error));
      });
  };
};


export const editAgent = (agentbody, userid, token) => {

var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/json',
            },

          };
       var data =  {
         personid : agentbody._id,
         role : agentbody.role,
      }


  // console.log("THis is the token in action " + token);
  return (dispatch) => {
    axios.post(`${baseURL}/api/users/updaterole/`, data,config)
      .then((res) => 

    {
      // dispatch(agentFetch(token,userid));
      dispatch(agentRoleUpdate(res));
      console.log("Agent role update");
  })
      .catch(function (error) {
         console.log('Error occured');
         console.log(error);
        dispatch(agentRoleUpdate(error));
        
      });
  };
};
export function confirmInvite(invite) {
  // console.log('Success');
  // console.log(invite);
  var status = '';
  if(invite.data.msg){
    status = invite.data.msg;
  }else{
    status = 'Something went wrong'
  }
  return {
    type: ActionTypes.INVITE_AGENTS,
    payload : status,

  };
}

export function agentRoleUpdate(res) {
   console.log(res);
  // console.log(invite);
  var status = '';
  if(res.data.status == "success"){
    status = 200
  }

  else{
    status = 422
  }
  return {
    type: ActionTypes.AGENT_ROLE_UPDATE,
    payload : status,


  };
}

export function deleteAGENT(res,agent){
  console.log(res);
  if(res.data && res.data.status == "success"){
  return {
    type: ActionTypes.AGENT_DELETE,
    payload : 200,
    agent:agent,


  };
}
  else{
      return {
          type: ActionTypes.AGENT_DELETE,
          payload : 422,

        };
  }

}
export function deleteAgent(agent,token){

  var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/json',
            },

          };
   // console.log("THis is the token in action " + token);
  return (dispatch) => {
    axios.post(`${baseURL}/api/users/deleteagent/${agent._id}`,{},config)
      .then((res) => dispatch(deleteAGENT(res,agent)))
      .catch(function (error) {
         console.log('Error occured');
         console.log(error);
        dispatch(deleteAGENT(error,agent));
      });
  };
};



/**** SQLite***/

export function callbackagents(results) {
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
    type: ActionTypes.ADD_AGENTS,
    payload : fteams,

  };
}



export  function writeAgents(agents){
  console.log(agents._id)
  console.log(agents.firstname)
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Agents_TABLE = "CREATE TABLE AGENTS ("
                + "_id TEXT PRIMARY KEY,"
                + "email TEXT,"
                + "firstname TEXT,"
                + "lastname TEXT,"
                + "uniqueid TEXT,"
                + "isAgent TEXT,"
                + "isAdmin TEXT,"
                + "isSupervisor TEXT,"
                + "role TEXT" + ")";

 var rows = []
 for(var i=0;i<agents.length;i++){
  var record = []
  record.push(agents[i]._id)
  record.push(agents[i].email);
  record.push(agents[i].firstname);
  record.push(agents[i].lastname);
  record.push(agents[i].uniqueid);
  record.push(agents[i].isAgent);
  record.push(agents[i].isAdmin);
  record.push(agents[i].isSupervisor);
  record.push(agents[i].role);
  rows.push(record);
 // addItem(db,record);


 }
 console.log(rows);


return (dispatch) => {

    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS AGENTS');
    tx.executeSql(CREATE_Agents_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO AGENTS VALUES (?,?,?,?,?,?,?,?,?)',rows[j]);

    }
    tx.executeSql('SELECT * FROM AGENTS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;

        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackagents(res));
  }
  );

  }

}

export function readAgents(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {

    db.transaction(function(tx) {

    tx.executeSql('SELECT * FROM AGENTS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;

        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackagents(res));
  }
  );

  }

}
