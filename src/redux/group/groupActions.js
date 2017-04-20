//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
import utils from '../../services/utils';
var querystring = require('querystring');
//var baseURLKiboEngage = `http://localhost:8000`
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;
import {
 
  Alert,
 
} from 'react-native';
export function showGroups(groups) {
  // console.log('show groups');
  // console.log(groups);

  return {
    type: ActionTypes.ADD_GROUPS,
    payload : groups.data,

  };
}


export function showMyGroups(groups) {
  // console.log('show my groups');
  // console.log(groups);
  return {
    type: ActionTypes.ADD_MY_GROUPS,
    payload : groups.data,

  };
}

export function showDeptAgents(groupagents) {
  // console.log('show dept agents');
  // console.log(groupagents.data);
  return {
    type: ActionTypes.ADD_GROUP_AGENTS,
    payload : groupagents.data,

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
    axios.get(`${baseURL}/api/departments`,config)
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

export const myGroupFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/departments/mydepartmentsKiboEngage`,config)
    .then((res) => res).then(res => dispatch(showMyGroups(res)));


  };
};


export const agentGroupFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/deptagents`,config)
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



// create group
export const creategroup = (group) => {
    var token = group.token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': token,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
       var data =  {
        deptname : group.groupname,
        deptdescription : group.description,
      
      }
  // console.log(data);
  return (dispatch) => {
    dispatch(groupCreateInAction());
    // console.log('calling api');
    axios.post(`${baseURLKiboEngage}/api/creategroup`,querystring.stringify(data),config).then(res => dispatch(groupCreateSuccess(res)))
      .catch(function (error) {
        // console.log('Error occured');
        // console.log(error);
        dispatch(groupCreateFail());
      });

  };
};


export const editgroup = (group) => {
    var token = group.token;
    // console.log('without remove_dups');
    // console.log(group.deptagents);
    var remove_dups = utils.removeDuplicates(group.deptagents, '_id');
    // console.log('removeDuplicates');
    // console.log(remove_dups);
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/json'
            },
      
          };
    var d = {
          _id:group.id,
          deptname: group.name,
          deptdescription: group.desc,
        }
    var data = {
      'dept' : d,
      'deptagents': remove_dups,
      
      }


  // console.log('data of edit group');
  // console.log(data);
  return (dispatch) => {
    dispatch(groupEditInAction());
    // console.log('calling api');
    axios.post(`${baseURL}/api/departments/update/`,data,config).then(res => dispatch(groupEditSuccess(res)))
      .catch(function (error) {
        //console.log(error.response)
        // console.log('Error occured');
        // console.log(error);
        dispatch(groupEditFail());
      });
    
  };
};





const groupCreateInAction = () => {
  return {
    type: ActionTypes.CREATE_GROUP,

  };
};



const groupCreateFail = () => {
  return{ type: ActionTypes.CREATE_GROUP_FAIL };
};

const groupCreateSuccess = (res) => {
  // console.log('group created');
  //Actions.main();
  return{
    type: ActionTypes.CREATE_GROUP_SUCCESS,
    payload: res
  };


};

const groupEditInAction = () => {
  return {
    type: ActionTypes.EDIT_GROUP,
   
  };
};



const groupEditFail = () => {
  return{ type: ActionTypes.EDIT_GROUP_FAIL };
};

const groupEditSuccess = (res) => {
  // console.log('group created');
  //Actions.main();
  return{
    type: ActionTypes.EDIT_GROUP_SUCCESS,
    payload: res
  };

  
};

const groupDeleteSuccess = (res) => {
  // console.log('group deleted');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_GROUP_SUCCESS,
    payload: res
  };


};

const groupDeleteFail = (res) => {
  // console.log('group deleted fail');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_GROUP_FAIL,
    payload: res
  };


};

// delete group
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
  //  console.log('calling api');
    axios.delete(`${baseURL}/api/departments/kiboengage/${id}`,config).then(res => dispatch(groupDeleteSuccess(res)))
      .catch(function (error) {
        // console.log('Error occured');
        // console.log(error);
        dispatch(groupDeleteFail());
      });

  };
};



/***** SQLite Actions **********/
export function callbackgroups(results) {
 var fgroups = []
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row');
    console.log(row);
    fgroups.push(row);
  }
  console.log('fgroups');
  console.log(fgroups);
 
  return {
    type: ActionTypes.ADD_GROUPS,
    payload : fgroups,
 
  };
}


export function callbackgroupAgents(results) {
 var fgroups = []
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row');
    console.log(row);
    fgroups.push(row);
  }
  console.log(fgroups);
 
  return {
    type: ActionTypes.ADD_GROUP_AGENTS,
    payload : fgroups,
 
  };
}


export  function writeGroups(groups){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Groups_TABLE = "CREATE TABLE GROUPS ("
                + "_id TEXT PRIMARY KEY,"
                + "deptname TEXT,"
                + "deptdescription TEXT,"
                + "companyid TEXT,"
                + "createdby TEXT,"
                + "creationdate TEXT,"
                + "isFbGroup TEXT,"
                + "fbPageID TEXT,"
                + "deleteStatus TEXT" + ")";

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




export  function writeGroupAgents(groupAgents){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_GroupAgents_TABLE = "CREATE TABLE GROUPAGENTS ("
                + "_id TEXT PRIMARY KEY,"
                + "agentid TEXT,"
                + "companyid TEXT,"
                + "deptid TEXT,"
                + "joindate TEXT,"
                + "deleteStatus TEXT" + ")";

 var rows = []
 for(var i=0;i<groupAgents.length;i++){
  var record = []
  record.push(groupAgents[i]._id)
  record.push(groupAgents[i].agentid);
  record.push(groupAgents[i].companyid);
  record.push(groupAgents[i].deptid);
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
