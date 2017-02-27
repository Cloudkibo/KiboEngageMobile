import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
import utils from '../../services/utils';
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')

var baseURL = `https://api.kibosupport.com`
var baseURLKiboEngage = `http://kiboengage.cloudapp.net`
var querystring = require('querystring');
//var baseURLKiboEngage = `http://localhost:8000`
export function showGroups(groups) {
  console.log('Groups data');
  //console.log(groups.data);
    return {
      type: ActionTypes.ADD_GROUPS,
      payload : groups.data,

    };
}


export function showMyGroups(mygroups) {
  console.log('Mygroups');
  console.log(mygroups.data);
  if(mygroups.data.createdDept){
    console.log('true')
    return {
      type: ActionTypes.ADD_MY_GROUPS,
      payload : mygroups.data.createdDept,

    };
  }

  else{
     return {
      type: ActionTypes.ADD_MY_GROUPS,
      payload : mygroups.data,

    };
  }
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
    .then((res) => res).then(res => dispatch(writeGroups(res.data)))
     .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readGroups());
        }
       }); 

  };
};


export const mygroupFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/groups/mygroups`,config)
    .then((res) => res).then(res => dispatch(showMyGroups(res)));

  };
};
// create group
export const creategroup = (group) => {
    var token = group.token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
      var data =  {
          groupname: group.groupname,
          groupdescription: group.groupdescription,
          status : group.status,


      }
  console.log(data);
  return (dispatch) => {
   console.log('calling api');
    axios.post(`${baseURL}/api/groups`,querystring.stringify(data),config).then(res => dispatch(groupCreateSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(groupCreateFail());
      });

  };
};



const groupCreateFail = () => {
  return{ type: ActionTypes.CREATE_GROUP_FAIL };
};

const groupCreateSuccess = (res) => {
  //Actions.main();
  return{
    type: ActionTypes.CREATE_GROUP_SUCCESS,
    payload: res
  };


};


// fetch agents in groups list

export function showGroupAgents(groupagents) {
  console.log('show group agents');
  return {
    type: ActionTypes.ADD_GROUP_AGENTS,
    payload : groupagents.data,

  };
}
export const agentGroupFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/groupagents`,config)
    .then((res) => res).then(res => dispatch(writeGroupAgents(res.data)))
     .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readGroupAgents());
        }
       }); 

  };
};


export const editgroup = (group) => {
    var token = group.token;
    console.log('without remove_dups');
    console.log(group.groupagents);
    var remove_dups = utils.removeDuplicates(group.groupagents, '_id');
    console.log('removeDuplicates');
    console.log(remove_dups);
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/json'
            },

          };
    var d = {
          _id:group.id,
          groupname: group.name,
          groupdescription: group.desc,
          status : group.status,
        }
    var data = {
      'group' : d,
      'groupagents': remove_dups,

      }


  console.log('data of edit group');
  console.log(data);
  return (dispatch) => {

    console.log('calling api');
    axios.post(`${baseURL}/api/groups/update/`,data,config).then(res => dispatch(groupEditSuccess(res)))
      .catch(function (error) {
        //console.log(error.response)
        console.log('Error occured');
        console.log(error);
        dispatch(groupEditFail());
      });

  };
};


const groupEditFail = () => {
  return{ type: ActionTypes.EDIT_GROUP_FAIL };
};

const groupEditSuccess = (res) => {
  console.log('group edited');
  //Actions.main();
  return{
    type: ActionTypes.EDIT_GROUP_SUCCESS,
    payload: res
  };


};

const groupDeleteFail = () => {
  return{ type: ActionTypes.DELETE_GROUP_FAIL };
};

const groupDeleteSuccess = (res) => {
  console.log('group deleted');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_GROUP_SUCCESS,
    payload: res
  };


};

// delete team
export const deletegroup = (group) => {
    var token = group.token;
    var id =  group.id;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
  return (dispatch) => {
   console.log('calling api');
    axios.delete(`${baseURL}/api/groups/${id}`,config).then(res => dispatch(groupDeleteSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(groupDeleteFail());
      });

  };
};



// join group
const groupJoinFail = () => {
  return{ type: ActionTypes.JOIN_GROUP_FAIL };
};

const groupJoinSuccess = (res) => {
  console.log('group joined');
  //Actions.main();
  return{
    type: ActionTypes.JOIN_GROUP_SUCCESS,
    payload: res
  };


};
export const joingroup = (group) => {
    var token = group.token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
      var data =  {
           groupid:group.groupid,
           agentid : group.agentid,


      }
  console.log(data);
  return (dispatch) => {
   console.log('calling api');
    axios.post(`${baseURL}/api/groups/join/`,querystring.stringify(data),config).then(res => dispatch(groupJoinSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(groupJoinFail());
      });

  };
};


/*** SQlite ****/
export function callbackgroups(results) {
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
    type: ActionTypes.ADD_GROUPS,
    payload : fteams,
 
  };
}
export function callbackgroupAgents(results) {
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
    type: ActionTypes.ADD_GROUP_AGENTS,
    payload : fteams,
 
  };
}


export  function writeGroups(groups){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Groups_TABLE = "CREATE TABLE GROUPS ("
                + "_id TEXT PRIMARY KEY,"
                + "groupname TEXT,"
                + "groupdescription TEXT,"
                + "companyid TEXT,"
                + "createdby TEXT,"
                + "creationdate TEXT,"
                + "status TEXT,"
                + "deleteStatus TEXT" + ")";

 var rows = []
 for(var i=0;i<groups.length;i++){
  var record = []
  record.push(groups[i]._id)
  record.push(groups[i].groupname);
  record.push(groups[i].groupdescription);
  record.push(groups[i].companyid);
  record.push(groups[i].createdby._id);
  record.push(groups[i].creationdate);
  record.push(groups[i].status);
  record.push(groups[i].deleteStatus);
  rows.push(record);
 // addItem(db,record);

  
 }
 console.log(rows);


return (dispatch) => {
    
    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS GROUPS');
    tx.executeSql(CREATE_Groups_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO GROUPS VALUES (?,?,?,?,?,?,?,?)',rows[j]);
   
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




export  function writeGroupAgents(groupAgents){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_GroupAgents_TABLE = "CREATE TABLE GROUPAGENTS ("
                + "_id TEXT PRIMARY KEY,"
                + "groupid TEXT,"
                + "companyid TEXT,"
                + "agentid TEXT,"
                + "joindate TEXT,"
                + "deleteStatus TEXT" + ")";

 var rows = []
 for(var i=0;i<groupAgents.length;i++){
  var record = []
  record.push(groupAgents[i]._id)
  record.push(groupAgents[i].groupid._id);
  record.push(groupAgents[i].companyid);
  record.push(groupAgents[i].agentid._id);
  record.push(groupAgents[i].joindate);
  record.push(groupAgents[i].deleteStatus);
  rows.push(record);
 // addItem(db,record);

  
 }
 console.log(rows);


return (dispatch) => {
    
    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS GROUPAGENTS');
    tx.executeSql(CREATE_GroupAgents_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO GROUPAGENTS VALUES (?,?,?,?,?,?)',rows[j]);
   
    }
    tx.executeSql('SELECT * FROM GROUPAGENTS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackgroupAgents(res));
  }
  );
  
  }

}

export function readGroups(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {
    
    db.transaction(function(tx) {
   
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


export function readGroupAgents(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {
    
    db.transaction(function(tx) {
   
    tx.executeSql('SELECT * FROM GROUPAGENTS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackgroupAgents(res));
  }
  );
  
  }

}