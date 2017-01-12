//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

export function showTeams(teams) {
  console.log('show teams');
  console.log(teams);
  return {
    type: ActionTypes.ADD_TEAMS,
    payload : teams.data,

  };
}

export function showDeptAgents(teamagents) {
  console.log('show dept agents');
  console.log(teamagents.data);
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
    .then((res) => res).then(res => dispatch(showTeams(res)));

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
    .then((res) => res).then(res => dispatch(showDeptAgents(res)));

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
        deptname : team.teamname,
        deptdescription : team.description,

      }
  console.log(data);
  return (dispatch) => {
    dispatch(teamCreateInAction());
    console.log('calling api');
    axios.post(`${baseURL}/api/departments/kiboengage`,querystring.stringify(data),config).then(res => dispatch(teamCreateSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(teamCreateFail());
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
  console.log('team created');
  //Actions.main();
  return{
    type: ActionTypes.CREATE_TEAM_SUCCESS,
    payload: res
  };


};

const teamDeleteSuccess = (res) => {
  console.log('team deleted');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_TEAM_SUCCESS,
    payload: res
  };


};

const teamDeleteFail = (res) => {
  console.log('team deleted fail');
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
   console.log('calling api');
    axios.delete(`${baseURL}/api/departments/kiboengage/${id}`,config).then(res => dispatch(teamDeleteSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(teamDeleteFail());
      });

  };
};
