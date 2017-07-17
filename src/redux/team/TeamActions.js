import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
import utils from '../../services/utils';
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')

var querystring = require('querystring');

import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

//var baseURLKiboEngage = `http://localhost:8000`
export function showTeams(teams) {
  console.log('Teams data');
  //console.log(teams.data);
    return {
      type: ActionTypes.ADD_TEAMS,
      payload : teams.data,

    };
}


export function showMyTeams(myteams) {
  console.log('Myteams');
  console.log(myteams.data);
  if(myteams.data.createdDept){
    console.log('true')
    return {
      type: ActionTypes.ADD_MY_TEAMS,
      payload : myteams.data.createdDept,

    };
  }

  else{
     return {
      type: ActionTypes.ADD_MY_TEAMS,
      payload : myteams.data,

    };
  }
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
    axios.get(`${baseURL}/api/groups`,config)
    .then((res) => res).then(res =>

      dispatch(writeTeams(res.data))
 //dispatch(readTeams())
      )
     .catch(function (error) {
        console.log('Error occured');
        console.log(error);
       // if(error = 'Network Error')
      //  {
          //Alert.alert('You are not connected with Internet');
          dispatch(readTeams());
        //}
       });

  };
};

export const myteamFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/groups/mygroups`,config)
    .then((res) => res).then(res => dispatch(showMyTeams(res)));

  };
};
// create team
export const createteam = (team) => {
    var token = team.token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
      var data =  {
          groupname: team.groupname,
          groupdescription: team.groupdescription,
          status : team.status,


      }
  console.log(data);
  return (dispatch) => {
   console.log('calling api');
    axios.post(`${baseURL}/api/groups`,querystring.stringify(data),config).then(res => dispatch(teamCreateSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(teamCreateFail());
      });

  };
};



const teamCreateFail = () => {
  return{ type: ActionTypes.CREATE_TEAM_FAIL };
};

const teamCreateSuccess = (res) => {
  //Actions.main();
  return{
    type: ActionTypes.CREATE_TEAM_SUCCESS,
    payload: res
  };


};


// fetch agents in teams list

export function showTeamAgents(teamagents) {
  console.log('show team agents');
  return {
    type: ActionTypes.ADD_TEAM_AGENTS,
    payload : teamagents.data,

  };
}

export const agentTeamFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/groupagents`,config)
    .then((res) => res).then(res => {
      console.log(res.data);
      dispatch(writeTeamAgents(res.data))
    }
      )
     .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        //if(error = 'Network Error')
        //{
          //Alert.alert('You are not connected with Internet');
          dispatch(readTeamAgents());
        //}
       });

  };
};

export const editteam = (team) => {
    var token = team.token;
    console.log('without remove_dups');
    console.log(team.teamagents);
    var remove_dups = utils.removeDuplicates(team.teamagents, '_id');
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
          _id:team.id,
          groupname: team.name,
          groupdescription: team.desc,
          status : team.status,
        }
    var data = {
      'group' : d,
      'groupagents': remove_dups,

      }


  console.log('data of edit team');
  console.log(data);
  return (dispatch) => {

    console.log('calling api');
    axios.post(`${baseURL}/api/groups/update/`,data,config).then(res => {
      dispatch(teamEditSuccess(res));
      dispatch(teamFetch(token));
      dispatch(myteamFetch(token));
    })
      .catch(function (error) {
        console.log(error.response)
        console.log('Error occured');
        console.log(error);
        dispatch(teamEditFail());
      });

  };
};


const teamEditFail = () => {
  return{ type: ActionTypes.EDIT_TEAM_FAIL };
};

const teamEditSuccess = (res) => {
  console.log('team edited');
  //Actions.main();
  return{
    type: ActionTypes.EDIT_TEAM_SUCCESS,
    payload: res
  };


};

const teamDeleteFail = () => {
  return{ type: ActionTypes.DELETE_TEAM_FAIL };
};

const teamDeleteSuccess = (res) => {
  console.log('team deleted');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_TEAM_SUCCESS,
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
   console.log('calling api');
    axios.delete(`${baseURL}/api/groups/${id}`,config).then(res => {
      dispatch(teamDeleteSuccess(res));
      dispatch(teamFetch(token));
  })
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(teamDeleteFail());
      });

  };
};



// join team
const teamJoinFail = () => {
  return{ type: ActionTypes.JOIN_TEAM_FAIL };
};

const teamJoinSuccess = (res) => {
  console.log('team joined');
  //Actions.main();
  return{
    type: ActionTypes.JOIN_TEAM_SUCCESS,
    payload: res
  };


};
export const jointeam = (team) => {
    var token = team.token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
      var data =  {
           teamid:team.teamid,
           agentid : team.agentid,


      }
  console.log(data);
  return (dispatch) => {
   console.log('calling api');
    axios.post(`${baseURL}/api/groups/join/`,querystring.stringify(data),config).then(res => dispatch(teamJoinSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(teamJoinFail());
      });

  };
};


/*** SQlite ****/
export function callbackteams(results) {
 var fteams = []
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row');
    fteams.push(row);
  }
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
                + "groupname TEXT,"
                + "groupdescription TEXT,"
                + "companyid TEXT,"
                + "createdby TEXT,"
                + "creationdate TEXT,"
                + "status TEXT,"
                + "deleteStatus TEXT" + ")";

 var rows = []
 for(var i=0;i<teams.length;i++){
  var record = []
  record.push(teams[i]._id)
  record.push(teams[i].groupname);
  record.push(teams[i].groupdescription);
  record.push(teams[i].companyid);
  record.push(teams[i].createdby._id);
  record.push(teams[i].creationdate);
  record.push(teams[i].status);
  record.push(teams[i].deleteStatus);
  rows.push(record);
 // addItem(db,record);


 }
 console.log(rows);


return (dispatch) => {

    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS TEAMS');
    tx.executeSql(CREATE_Teams_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO TEAMS VALUES (?,?,?,?,?,?,?,?)',rows[j]);

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
                + "groupid TEXT,"
                + "companyid TEXT,"
                + "agentid TEXT,"
                + "joindate TEXT,"
                + "deleteStatus TEXT" + ")";

 var rows = []
 for(var i=0;i<teamAgents.length;i++){
  var record = []
  record.push(teamAgents[i]._id)
  record.push(teamAgents[i].groupid._id);
  record.push(teamAgents[i].companyid);
  record.push(teamAgents[i].agentid._id);
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
