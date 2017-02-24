import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
import utils from '../../services/utils';

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
    .then((res) => res).then(res => dispatch(showGroups(res)));

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
    .then((res) => res).then(res => dispatch(showGroupAgents(res)));

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
