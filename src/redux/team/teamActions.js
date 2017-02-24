//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
import utils from '../../services/utils';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');
var baseURLKiboEngage = `http://kiboengage.cloudapp.net`
//var baseURLKiboEngage = `http://localhost:8000`
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')
import {
 
  Alert,
 
} from 'react-native';
export function showTeams(teams) {
  // console.log('show teams');
  // console.log(teams);

  return {
    type: ActionTypes.ADD_TEAMS,
    payload : teams.data,

  };
}


export function showMyTeams(teams) {
  // console.log('show my teams');
  // console.log(teams);
  return {
    type: ActionTypes.ADD_MY_TEAMS,
    payload : teams.data,

  };
}

export function showDeptAgents(teamagents) {
  // console.log('show dept agents');
  // console.log(teamagents.data);
  return {
    type: ActionTypes.ADD_TEAM_AGENTS,
    payload : teamagents.data,

  };
}

export const teamFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/departments`,config)
    .then((res) => res).then(res => dispatch(writeTeams(res.data)))
     .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readTeams());
        }
       }); 
  };
};

export const myTeamFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/departments/mydepartmentsKiboEngage`,config)
    .then((res) => res).then(res => dispatch(showMyTeams(res)));


  };
};


export const agentTeamFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/deptagents`,config)
    .then((res) => res).then(res => dispatch(writeTeamAgents(res.data)))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readTeamAgents());
        }
       }); 
  };
};



// create team
export const createteam = (team) => {
    var token = team.token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': token,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
       var data =  {
        deptname : team.teamname,
        deptdescription : team.description,
      
      }
  // console.log(data);
  return (dispatch) => {
    dispatch(teamCreateInAction());
    // console.log('calling api');
    axios.post(`${baseURLKiboEngage}/api/createteam`,querystring.stringify(data),config).then(res => dispatch(teamCreateSuccess(res)))
      .catch(function (error) {
        // console.log('Error occured');
        // console.log(error);
        dispatch(teamCreateFail());
      });

  };
};


export const editteam = (team) => {
    var token = team.token;
    // console.log('without remove_dups');
    // console.log(team.deptagents);
    var remove_dups = utils.removeDuplicates(team.deptagents, '_id');
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
          _id:team.id,
          deptname: team.name,
          deptdescription: team.desc,
        }
    var data = {
      'dept' : d,
      'deptagents': remove_dups,
      
      }


  // console.log('data of edit team');
  // console.log(data);
  return (dispatch) => {
    dispatch(teamEditInAction());
    // console.log('calling api');
    axios.post(`${baseURL}/api/departments/update/`,data,config).then(res => dispatch(teamEditSuccess(res)))
      .catch(function (error) {
        //console.log(error.response)
        // console.log('Error occured');
        // console.log(error);
        dispatch(teamEditFail());
      });
    
  };
};





const teamCreateInAction = () => {
  return {
    type: ActionTypes.CREATE_TEAM,

  };
};



const teamCreateFail = () => {
  return{ type: ActionTypes.CREATE_TEAM_FAIL };
};

const teamCreateSuccess = (res) => {
  // console.log('team created');
  //Actions.main();
  return{
    type: ActionTypes.CREATE_TEAM_SUCCESS,
    payload: res
  };


};

const teamEditInAction = () => {
  return {
    type: ActionTypes.EDIT_TEAM,
   
  };
};



const teamEditFail = () => {
  return{ type: ActionTypes.EDIT_TEAM_FAIL };
};

const teamEditSuccess = (res) => {
  // console.log('team created');
  //Actions.main();
  return{
    type: ActionTypes.EDIT_TEAM_SUCCESS,
    payload: res
  };

  
};

const teamDeleteSuccess = (res) => {
  // console.log('team deleted');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_TEAM_SUCCESS,
    payload: res
  };


};

const teamDeleteFail = (res) => {
  // console.log('team deleted fail');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_TEAM_FAIL,
    payload: res
  };


};

// delete team
export const deleteteam = (team) => {
    var token = team.token;
    var id =  team.id;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
  return (dispatch) => {
  //  console.log('calling api');
    axios.delete(`${baseURL}/api/departments/kiboengage/${id}`,config).then(res => dispatch(teamDeleteSuccess(res)))
      .catch(function (error) {
        // console.log('Error occured');
        // console.log(error);
        dispatch(teamDeleteFail());
      });

  };
};



/***** SQLite Actions **********/
export function callbackteams(results) {
 var fteams = []
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row');
    console.log(row);
    fteams.push(row);
  }
  console.log('fteams');
  console.log(fteams);
 
  return {
    type: ActionTypes.ADD_TEAMS,
    payload : fteams,
 
  };
}


export function callbackteamAgents(results) {
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
    type: ActionTypes.ADD_TEAM_AGENTS,
    payload : fteams,
 
  };
}


export  function writeTeams(teams){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Teams_TABLE = "CREATE TABLE TEAMS ("
                + "_id TEXT PRIMARY KEY,"
                + "deptname TEXT,"
                + "deptdescription TEXT,"
                + "companyid TEXT,"
                + "createdby TEXT,"
                + "creationdate TEXT,"
                + "isFbTeam TEXT,"
                + "fbPageID TEXT,"
                + "deleteStatus TEXT" + ")";

 var rows = []
 for(var i=0;i<teams.length;i++){
  var record = []
  record.push(teams[i]._id)
  record.push(teams[i].deptname);
  record.push(teams[i].deptdescription);
  record.push(teams[i].companyid);
  record.push(teams[i].createdby._id);
  record.push(teams[i].creationdate);
  record.push(teams[i].deleteStatus);
  record.push(teams[i].isFbTeam);
  record.push(teams[i].fbPageID?teams[i].fbPageID:"");
  rows.push(record);
 // addItem(db,record);

  
 }
 console.log(rows);


return (dispatch) => {
    
    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS TEAMS');
    tx.executeSql(CREATE_Teams_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO TEAMS VALUES (?,?,?,?,?,?,?,?,?)',rows[j]);
   
    }
    tx.executeSql('SELECT * FROM TEAMS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackteams(res));
  }
  );
  
  }

}




export  function writeTeamAgents(teamAgents){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_TeamAgents_TABLE = "CREATE TABLE TEAMAGENTS ("
                + "_id TEXT PRIMARY KEY,"
                + "agentid TEXT,"
                + "companyid TEXT,"
                + "deptid TEXT,"
                + "joindate TEXT,"
                + "deleteStatus TEXT" + ")";

 var rows = []
 for(var i=0;i<teamAgents.length;i++){
  var record = []
  record.push(teamAgents[i]._id)
  record.push(teamAgents[i].agentid);
  record.push(teamAgents[i].companyid);
  record.push(teamAgents[i].deptid);
  record.push(teamAgents[i].joindate);
  record.push(teamAgents[i].deleteStatus);
  rows.push(record);
 // addItem(db,record);

  
 }
 console.log(rows);


return (dispatch) => {
    
    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS TEAMAGENTS');
    tx.executeSql(CREATE_TeamAgents_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO TEAMAGENTS VALUES (?,?,?,?,?,?)',rows[j]);
   
    }
    tx.executeSql('SELECT * FROM TEAMAGENTS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackteamAgents(res));
  }
  );
  
  }

}

export function readTeams(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {
    
    db.transaction(function(tx) {
   
    tx.executeSql('SELECT * FROM TEAMS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackteams(res));
  }
  );
  
  }

}


export function readTeamAgents(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {
    
    db.transaction(function(tx) {
   
    tx.executeSql('SELECT * FROM TEAMAGENTS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackteamAgents(res));
  }
  );
  
  }

}

